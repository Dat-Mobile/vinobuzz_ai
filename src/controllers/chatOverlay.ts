export type ChatOverlayCommand = "open" | "close" | "minimize" | "toggle";

type Listener = (command: ChatOverlayCommand) => void;

const listeners = new Set<Listener>();

export const subscribeChatOverlay = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const emit = (command: ChatOverlayCommand) => {
  listeners.forEach((listener) => listener(command));
};

export const openChatOverlay = () => emit("open");
export const closeChatOverlay = () => emit("close");
export const minimizeChatOverlay = () => emit("minimize");
export const toggleChatOverlay = () => emit("toggle");
