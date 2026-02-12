export type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  viewProductId?: string;
};

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    text: 'Welcome back. I can recommend a refined red for your boss milestone dinner.',
    timestamp: '18:02'
  },
  {
    id: 'm2',
    role: 'user',
    text: 'Looking for something bold but elegant under HK$2,000.',
    timestamp: '18:03'
  },
  {
    id: 'm3',
    role: 'assistant',
    text: 'Great choice. Chateau Leoville-Las Cases 2020 matches that profile perfectly.',
    timestamp: '18:03'
  },
  {
    id: 'm4',
    role: 'assistant',
    text: 'I found one bottle that matches your taste and budget. Tap below to view details.',
    timestamp: '18:04',
    viewProductId: '123'
  }
];

export const quickReplies = ['Pair with steak', 'Under HK$2,500', 'Show similar wine'];
