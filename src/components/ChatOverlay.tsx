import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { ChatMessage, initialMessages, quickReplies } from '../data/chat';
import { TypingIndicator } from './TypingIndicator';

type ChatOverlayProps = {
  onViewProduct: (id: string) => void;
};

type ChatState = 'hidden' | 'minimized' | 'expanded';
type ChatIcon = 'chat-outline' | 'chat-processing-outline' | 'chevron-down';

const iconByState: Record<ChatState, ChatIcon> = {
  hidden: 'chat-outline',
  minimized: 'chat-processing-outline',
  expanded: 'chevron-down'
};

export const ChatOverlay = ({ onViewProduct }: ChatOverlayProps) => {
  const [state, setState] = useState<ChatState>('hidden');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');

  const showTyping = useMemo(() => state === 'expanded', [state]);

  const openExpanded = () => setState('expanded');
  const closeChat = () => setState('hidden');
  const minimize = () => setState('minimized');

  const onSend = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        role: 'user',
        text,
        timestamp: 'Now'
      },
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: 'Great preference. I will tune recommendations around this profile.',
        timestamp: 'Now'
      }
    ]);
    setDraft('');
  };

  const onQuickReply = (label: string) => {
    setDraft(label);
  };

  const buttonIcon = iconByState[state];
  const showFloatingButton = state !== 'expanded';

  return (
    <>
      {state === 'expanded' ? <View style={styles.backdrop} /> : null}

      {showFloatingButton ? (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={state === 'hidden' ? openExpanded : state === 'minimized' ? openExpanded : closeChat}
          style={[styles.fab, state === 'minimized' && styles.miniFab]}
        >
          <MaterialCommunityIcons color={colors.white} name={buttonIcon} size={22} />
          {state === 'hidden' ? <Text style={styles.fabText}>Ask VinoBuzz</Text> : null}
        </TouchableOpacity>
      ) : null}

      {state === 'expanded' ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 18 : 0}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Vino Assistant</Text>
                <Text style={styles.sheetSubtitle}>Personal, approachable, unforgettable</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={minimize} style={styles.iconButton}>
                  <MaterialCommunityIcons color={colors.textPrimary} name="minus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={closeChat} style={styles.iconButton}>
                  <MaterialCommunityIcons color={colors.textPrimary} name="close" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.messageList} showsVerticalScrollIndicator={false}>
              {messages.map((message) => {
                const mine = message.role === 'user';
                return (
                  <View key={message.id} style={[styles.bubbleRow, mine ? styles.bubbleMine : styles.bubbleAssistant]}>
                    <View style={[styles.bubble, mine ? styles.bubbleMineBg : styles.bubbleAssistantBg]}>
                      <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{message.text}</Text>
                      {message.viewProductId ? (
                        <TouchableOpacity
                          onPress={() => onViewProduct(message.viewProductId!)}
                          style={styles.inlineProductButton}
                        >
                          <MaterialCommunityIcons color={colors.white} name="glass-wine" size={16} />
                          <Text style={styles.inlineProductText}>View product</Text>
                        </TouchableOpacity>
                      ) : null}
                      <Text style={[styles.timeText, mine && styles.timeTextMine]}>{message.timestamp}</Text>
                    </View>
                  </View>
                );
              })}

              {showTyping ? (
                <View style={styles.typingWrap}>
                  <TypingIndicator />
                </View>
              ) : null}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickReplyWrap}>
                {quickReplies.map((label) => (
                  <TouchableOpacity key={label} onPress={() => onQuickReply(label)} style={styles.quickReplyChip}>
                    <Text style={styles.quickReplyText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                onChangeText={setDraft}
                placeholder="Type your preference..."
                placeholderTextColor={colors.textSecondary}
                style={styles.input}
                value={draft}
              />
              <TouchableOpacity onPress={onSend} style={styles.sendButton}>
                <MaterialCommunityIcons color={colors.white} name="send" size={18} />
              </TouchableOpacity>
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
    zIndex: 30
  },
  fab: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    bottom: 28,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    right: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    zIndex: 40
  },
  miniFab: {
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: 56
  },
  fabText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800'
  },
  sheetWrap: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 40
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    flex: 1,
    marginTop: 64,
    overflow: 'hidden'
  },
  sheetHeader: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900'
  },
  sheetSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34
  },
  messageList: {
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.lg
  },
  bubbleRow: {
    flexDirection: 'row'
  },
  bubbleAssistant: {
    justifyContent: 'flex-start'
  },
  bubbleMine: {
    justifyContent: 'flex-end'
  },
  bubble: {
    borderRadius: 16,
    maxWidth: '82%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  bubbleAssistantBg: {
    backgroundColor: colors.surfaceSoft
  },
  bubbleMineBg: {
    backgroundColor: colors.brand
  },
  bubbleText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21
  },
  bubbleTextMine: {
    color: colors.white
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 6
  },
  timeTextMine: {
    color: 'rgba(255,255,255,0.8)'
  },
  inlineProductButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.brandDark,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  inlineProductText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800'
  },
  typingWrap: {
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 8
  },
  quickReplyWrap: {
    marginTop: 8
  },
  quickReplyChip: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  quickReplyText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700'
  },
  composer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: spacing.md
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.pill,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38
  }
});
