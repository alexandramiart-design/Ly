import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {getSetting, setSetting} from '../storage/memory';

export default function SettingsScreen() {
  const [token, setToken] = useState('');
  const [chatModel, setChatModel] = useState('');
  const [imageModel, setImageModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setToken(await getSetting('token'));
      setChatModel(await getSetting('chatModel'));
      setImageModel(await getSetting('imageModel'));
      setSystemPrompt(await getSetting('systemPrompt'));
    })();
  }, []);

  const onSave = async () => {
    try {
      await setSetting('token', token.trim());
      await setSetting('chatModel', chatModel.trim());
      await setSetting('imageModel', imageModel.trim());
      await setSetting('systemPrompt', systemPrompt.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e: any) {
      Alert.alert('Erreur', e.message || String(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Paramètres</Text>

        <Text style={styles.label}>Token Hugging Face</Text>
        <TextInput
          testID="settings-token"
          value={token}
          onChangeText={setToken}
          placeholder="hf_..."
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Modèle de chat</Text>
        <TextInput
          testID="settings-chat-model"
          value={chatModel}
          onChangeText={setChatModel}
          placeholder="meta-llama/Llama-3.2-3B-Instruct"
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Modèle d'image</Text>
        <TextInput
          testID="settings-image-model"
          value={imageModel}
          onChangeText={setImageModel}
          placeholder="black-forest-labs/FLUX.1-schnell"
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Personnalité (system prompt)</Text>
        <TextInput
          testID="settings-system-prompt"
          value={systemPrompt}
          onChangeText={setSystemPrompt}
          style={[styles.input, styles.multiline]}
          multiline
        />

        <Pressable
          testID="settings-save-button"
          onPress={onSave}
          style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>
            {saved ? '✓ Enregistré' : 'Enregistrer'}
          </Text>
        </Pressable>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Obtiens ton token sur{' '}
            <Text style={styles.link}>huggingface.co/settings/tokens</Text>
            {'\n\n'}
            Chat : n'importe quel modèle chat-completion supporté par les
            Inference Providers HF.{'\n'}
            Image : modèle text-to-image (FLUX, SDXL…).
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0d0d0f'},
  scroll: {padding: 16, paddingBottom: 60},
  title: {color: '#f5e6d3', fontSize: 22, fontWeight: '700', marginBottom: 16},
  label: {color: '#a9a9b3', fontSize: 13, marginBottom: 6, marginTop: 6},
  input: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f5e6d3',
    backgroundColor: '#1c1c20',
    fontSize: 14,
    marginBottom: 8,
  },
  multiline: {minHeight: 120, textAlignVertical: 'top'},
  saveBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c98d5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {color: '#1a1a1c', fontWeight: '700', fontSize: 15},
  infoBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1c1c20',
  },
  infoText: {color: '#a9a9b3', fontSize: 12, lineHeight: 18},
  link: {color: '#c98d5c'},
});
