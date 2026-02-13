import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { subscribeChatOverlay } from "../controllers/chatOverlay";
import { ChatMessage, initialMessages, quickReplies } from "../data/chat";
import { products } from "../data/products";
import { TypingIndicator } from "./TypingIndicator";

type ChatOverlayProps = {
  onViewProduct: (id: string) => void;
  disableFloatingButton?: boolean;
};

type ChatState = "hidden" | "minimized" | "expanded";
type ChatIcon = "chat-outline" | "chat-processing-outline" | "chevron-down";

const iconByState: Record<ChatState, ChatIcon> = {
  hidden: "chat-outline",
  minimized: "chat-processing-outline",
  expanded: "chevron-down",
};

const recommendationTemplates = [
  "Based on your preference, this bottle offers excellent structure and balance for a formal dinner. Please review the selection below.",
  "Thank you for sharing your profile. I recommend this wine for its refined finish and consistent quality across pairings.",
  "Considering your request, this option is a strong match in both style and value. You can review the product details below.",
];

const CHAT_MESSAGES_FILENAME = "vinobuzz-chat-messages.json";

export const ChatOverlay = ({
  onViewProduct,
  disableFloatingButton = false,
}: ChatOverlayProps) => {
  const [state, setState] = useState<ChatState>("hidden");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [overrideProductId, setOverrideProductId] = useState<string | null>(
    null,
  );
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [messagesHydrated, setMessagesHydrated] = useState(false);
  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recommendationIndexRef = useRef(0);
  const messageListRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const storageUri = useMemo(() => {
    if (!FileSystem.documentDirectory) {
      return null;
    }
    return `${FileSystem.documentDirectory}${CHAT_MESSAGES_FILENAME}`;
  }, []);

  const showTyping = useMemo(
    () => state === "expanded" && isAssistantTyping,
    [state, isAssistantTyping],
  );

  const scrollToBottom = useCallback((animated: boolean) => {
    requestAnimationFrame(() => {
      messageListRef.current?.scrollToEnd({ animated });
    });
  }, []);

  const openExpanded = () => {
    setState("expanded");
    scrollToBottom(false);
  };
  const closeChat = () => setState("hidden");
  const minimize = () => setState("minimized");

  useEffect(() => {
    return subscribeChatOverlay((command) => {
      setState((current) => {
        switch (command) {
          case "open":
            return "expanded";
          case "close":
            return "hidden";
          case "minimize":
            return "minimized";
          case "toggle":
            return current === "expanded" ? "hidden" : "expanded";
          default:
            return current;
        }
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const hydrateMessages = async () => {
      if (!storageUri) {
        if (mounted) {
          setMessagesHydrated(true);
        }
        return;
      }
      try {
        const info = await FileSystem.getInfoAsync(storageUri);
        if (info.exists) {
          const raw = await FileSystem.readAsStringAsync(storageUri);
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const normalized = parsed.filter(
              (item): item is ChatMessage =>
                item &&
                typeof item.id === "string" &&
                (item.role === "assistant" || item.role === "user") &&
                typeof item.text === "string" &&
                typeof item.timestamp === "string",
            );
            if (mounted && normalized.length > 0) {
              setMessages(normalized);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to hydrate chat messages", error);
      } finally {
        if (mounted) {
          setMessagesHydrated(true);
        }
      }
    };

    hydrateMessages();
    return () => {
      mounted = false;
    };
  }, [storageUri]);

  useEffect(() => {
    if (!messagesHydrated || !storageUri) {
      return;
    }
    const persistMessages = async () => {
      try {
        await FileSystem.writeAsStringAsync(
          storageUri,
          JSON.stringify(messages),
        );
      } catch (error) {
        console.warn("Failed to persist chat messages", error);
      }
    };
    persistMessages();
  }, [messages, messagesHydrated, storageUri]);

  useEffect(() => {
    if (state === "expanded") {
      scrollToBottom(false);
    }
  }, [state, scrollToBottom]);

  useEffect(() => {
    if (state === "expanded") {
      scrollToBottom(true);
    }
  }, [messages, state, scrollToBottom]);

  const getCurrentTimeLabel = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onSend = (value?: string, forcedProductId?: string | null) => {
    const text = (value ?? draft).trim();
    if (!text) {
      return;
    }

    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
    }

    const selectedProductId = forcedProductId ?? overrideProductId;
    const recommendedProduct = selectedProductId
      ? (products.find((p) => p.id === selectedProductId) ??
        products[recommendationIndexRef.current % products.length])
      : products[recommendationIndexRef.current % products.length];
    const template =
      recommendationTemplates[
        recommendationIndexRef.current % recommendationTemplates.length
      ];
    recommendationIndexRef.current += 1;

    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        role: "user",
        text,
        timestamp: getCurrentTimeLabel(),
      },
    ]);
    setIsAssistantTyping(true);

    // mock api return in 2-5s
    const delay = 2000 + Math.floor(Math.random() * 3000);
    suggestionTimerRef.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-suggestion-${Date.now()}`,
          role: "assistant",
          text: template,
          timestamp: getCurrentTimeLabel(),
          viewProductId: recommendedProduct.id,
        },
      ]);
      setIsAssistantTyping(false);
      suggestionTimerRef.current = null;
    }, delay);

    setDraft("");
    setOverrideProductId(null);
  };

  const findBestUnder = (limit: number) => {
    return (
      products
        .filter((p) => p.price < limit)
        .sort((a, b) => b.price - a.price)[0] ?? null
    );
  };

  const onQuickReply = (label: string) => {
    if (label === "Under HK$2,000") {
      const match = findBestUnder(2000);
      const productId = match?.id ?? null;
      setOverrideProductId(productId);
      onSend(label, productId);
    } else {
      setOverrideProductId(null);
      onSend(label);
    }
  };

  const buttonIcon = iconByState[state];
  const showFloatingButton = !disableFloatingButton && state !== "expanded";

  return (
    <>
      {state === "expanded" ? <View style={styles.backdrop} /> : null}

      {showFloatingButton ? (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={
            state === "hidden"
              ? openExpanded
              : state === "minimized"
                ? openExpanded
                : closeChat
          }
          style={[
            styles.fab,
            state === "minimized" && styles.miniFab,
            { bottom: insets.bottom + 16 },
          ]}
        >
          <MaterialCommunityIcons
            color={colors.white}
            name={buttonIcon}
            size={22}
          />
          {state === "hidden" ? (
            <Text style={styles.fabText}>Ask VinoBuzz</Text>
          ) : null}
        </TouchableOpacity>
      ) : null}

      {state === "expanded" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Vino Assistant</Text>
                <Text style={styles.sheetSubtitle}>
                  Personal, approachable, unforgettable
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={minimize} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    color={colors.textPrimary}
                    name="minus"
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={closeChat} style={styles.iconButton}>
                  <MaterialCommunityIcons
                    color={colors.textPrimary}
                    name="close"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              ref={messageListRef}
              contentContainerStyle={styles.messageList}
              onContentSizeChange={() => {
                if (state === "expanded") {
                  scrollToBottom(false);
                }
              }}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((message) => {
                const mine = message.role === "user";
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.bubbleRow,
                      mine ? styles.bubbleMine : styles.bubbleAssistant,
                    ]}
                  >
                    <View
                      style={[
                        styles.bubble,
                        mine ? styles.bubbleMineBg : styles.bubbleAssistantBg,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          mine && styles.bubbleTextMine,
                        ]}
                      >
                        {message.text}
                      </Text>
                      {message.viewProductId ? (
                        <TouchableOpacity
                          onPress={() => {
                            closeChat();
                            onViewProduct(message.viewProductId!);
                          }}
                          style={styles.inlineProductButton}
                        >
                          <MaterialCommunityIcons
                            color={colors.white}
                            name="glass-wine"
                            size={16}
                          />
                          <Text style={styles.inlineProductText}>
                            View product
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      <Text
                        style={[styles.timeText, mine && styles.timeTextMine]}
                      >
                        {message.timestamp}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {showTyping ? (
                <View style={styles.typingWrap}>
                  <TypingIndicator />
                </View>
              ) : null}
            </ScrollView>

            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickReplyContent}
              >
                {quickReplies.map((label) => (
                  <TouchableOpacity
                    key={label}
                    onPress={() => onQuickReply(label)}
                    style={styles.quickReplyChip}
                  >
                    <Text style={styles.quickReplyText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View
                style={[
                  styles.composer,
                  { paddingBottom: insets.bottom + spacing.xs },
                ]}
              >
                <TextInput
                  onChangeText={setDraft}
                  placeholder="Type your preference..."
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                  value={draft}
                />
                <TouchableOpacity
                  onPress={() => onSend()}
                  style={styles.sendButton}
                >
                  <MaterialCommunityIcons
                    color={colors.white}
                    name="send"
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 30,
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    bottom: 28,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: "absolute",
    right: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    zIndex: 40,
  },
  miniFab: {
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 0,
    width: 56,
  },
  fabText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  sheetWrap: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 40,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    flex: 1,
    marginTop: 64,
    overflow: "hidden",
  },
  sheetHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  sheetSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  messageList: {
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  bubbleRow: {
    flexDirection: "row",
  },
  bubbleAssistant: {
    justifyContent: "flex-start",
  },
  bubbleMine: {
    justifyContent: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleAssistantBg: {
    backgroundColor: colors.surfaceSoft,
  },
  bubbleMineBg: {
    backgroundColor: colors.brand,
  },
  bubbleText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  bubbleTextMine: {
    color: colors.white,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 6,
  },
  timeTextMine: {
    color: "rgba(255,255,255,0.8)",
  },
  inlineProductButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.brandDark,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  inlineProductText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "800",
  },
  typingWrap: {
    alignItems: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  quickReplyContent: {
    paddingHorizontal: spacing.sm2,
    paddingVertical: spacing.sm,
  },
  quickReplyChip: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickReplyText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  composer: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: spacing.sm2,
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.pill,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
});
