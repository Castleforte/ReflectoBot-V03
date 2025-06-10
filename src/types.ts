export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface MoodEntry {
  moodName: string;
  checkInText: string;
  timestamp: string;
}

export interface ConversationTurn {
  id: string;
  promptText: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
}