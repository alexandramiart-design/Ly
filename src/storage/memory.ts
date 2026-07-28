import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_CHAT_MODEL,
  DEFAULT_HF_TOKEN,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from '../config';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id?: string;
  ts?: number;
};

const KEYS = {
  history: '@lyra/history',
  token: '@lyra/hf_token',
  chatModel: '@lyra/chat_model',
  imageModel: '@lyra/image_model',
  systemPrompt: '@lyra/system_prompt',
};

export async function loadHistory(): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.history);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export async function saveHistory(msgs: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(msgs));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.history);
}

export async function getSetting(
  key: 'token' | 'chatModel' | 'imageModel' | 'systemPrompt',
): Promise<string> {
  const stored = await AsyncStorage.getItem(KEYS[key]);
  if (stored !== null) return stored;
  switch (key) {
    case 'token':
      return DEFAULT_HF_TOKEN;
    case 'chatModel':
      return DEFAULT_CHAT_MODEL;
    case 'imageModel':
      return DEFAULT_IMAGE_MODEL;
    case 'systemPrompt':
      return DEFAULT_SYSTEM_PROMPT;
  }
}

export async function setSetting(
  key: 'token' | 'chatModel' | 'imageModel' | 'systemPrompt',
  value: string,
): Promise<void> {
  await AsyncStorage.setItem(KEYS[key], value);
}
