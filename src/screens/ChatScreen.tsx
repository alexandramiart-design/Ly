import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {chatCompletion} from '../api/huggingface';
import {
  ChatMessage,
  clearHistory,
  getSetting,
  loadHistory,
  saveHistory,
} from '../storage/memory';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    (async () => {
      const h = await loadHistory();
      setMessages(h);
    })();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(
        () => listRef.current?.scrollToEnd({animated: true}),
        50,
      );
    }
  }, [messages]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      id: `${Date.now()}-u`,
      ts: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const [token, model, systemPrompt] = await Promise.all([
        getSetting('token'),
        getSetting('chatModel'),
        getSetting('systemPrompt'),
      ]);

      const reply = await chatCompletion({
        token,
        model,
        systemPrompt,
        history: next,
        userMessage: text,
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: reply,
        id: `${Date.now()}-a`,
        ts: Date.now(),
      };
      const final = [...next, assistantMsg];
      setMessages(final);
      await saveHistory(final);
    } catch (e: any) {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: `Oups mon petit, il y a eu un souci : ${e.message || e}`,
        id: `${Date.now()}-e`,
        ts: Date.now(),
      };
      setMessages([...next, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const onClear = async () => {
    await clearHistory();
    setMessages([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discussion avec Mamie Lyra</Text>
        <Pressable
          testID="chat-clear-button"
          onPress={onClear}
          style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Effacer</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item, idx) => item.id || String(idx)}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
            ]}>
            <Text
              style={[
                styles.bubbleText,
                item.role === 'user'
                  ? styles.bubbleTextUser
                  : styles.bubbleTextAssistant,
              ]}>
              {item.content}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Bonjour mon petit 🌸</Text>
            <Text style={styles.emptyText}>
              Je suis Mamie Lyra. Raconte-moi ta journée ou pose-moi une
              question, je suis toute ouïe.
            </Text>
          </View>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          testID="chat-input"
          value={input}
          onChangeText={setInput}
          placeholder="Écris à Mamie…"
          placeholderTextColor="#888"
          style={styles.input}
          multiline
          editable={!loading}
        />
        <Pressable
          testID="chat-send-button"
          onPress={onSend}
          disabled={loading || !input.trim()}
          style={[
            styles.sendBtn,
            (loading || !input.trim()) && styles.sendBtnDisabled,
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendBtnText}>Envoyer</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0d0d0f'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2a2e',
  },
  headerTitle: {color: '#f5e6d3', fontSize: 16, fontWeight: '600'},
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#2a2a2e',
  },
  clearBtnText: {color: '#f5e6d3', fontSize: 12},
  listContent: {padding: 16, paddingBottom: 24},
  bubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#c98d5c',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: '#1c1c20',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {fontSize: 15, lineHeight: 21},
  bubbleTextUser: {color: '#1a1a1c'},
  bubbleTextAssistant: {color: '#f5e6d3'},
  empty: {padding: 24, alignItems: 'center'},
  emptyTitle: {color: '#f5e6d3', fontSize: 20, marginBottom: 8},
  emptyText: {color: '#a9a9b3', fontSize: 14, textAlign: 'center'},
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2a2a2e',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#f5e6d3',
    backgroundColor: '#1c1c20',
    fontSize: 15,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: '#c98d5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {backgroundColor: '#5a4a3b'},
  sendBtnText: {color: '#1a1a1c', fontWeight: '600'},
});
