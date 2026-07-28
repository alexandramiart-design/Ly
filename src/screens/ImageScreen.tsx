import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {generateImage} from '../api/huggingface';
import {getSetting} from '../storage/memory';

export default function ImageScreen() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    const p = prompt.trim();
    if (!p || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const [token, model] = await Promise.all([
        getSetting('token'),
        getSetting('imageModel'),
      ]);
      const dataUri = await generateImage({token, model, prompt: p});
      setImage(dataUri);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Génération d'image</Text>
        <Text style={styles.subtitle}>
          Décris ce que tu veux dessiner. Ex : "un chaton roux endormi dans un
          panier"
        </Text>

        <TextInput
          testID="image-prompt-input"
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Décris ton image…"
          placeholderTextColor="#888"
          style={styles.input}
          multiline
          editable={!loading}
        />

        <Pressable
          testID="image-generate-button"
          onPress={onGenerate}
          disabled={loading || !prompt.trim()}
          style={[
            styles.btn,
            (loading || !prompt.trim()) && styles.btnDisabled,
          ]}>
          {loading ? (
            <ActivityIndicator color="#1a1a1c" />
          ) : (
            <Text style={styles.btnText}>Générer</Text>
          )}
        </Pressable>

        {error ? (
          <View testID="image-error" style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {image ? (
          <View style={styles.imageWrap}>
            <Image
              testID="image-result"
              source={{uri: image}}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ) : loading ? (
          <View style={styles.placeholder}>
            <ActivityIndicator size="large" color="#c98d5c" />
            <Text style={styles.placeholderText}>
              Génération en cours… ça peut prendre 10–30s
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0d0d0f'},
  scroll: {padding: 16, paddingBottom: 40},
  title: {color: '#f5e6d3', fontSize: 22, fontWeight: '700', marginBottom: 6},
  subtitle: {color: '#a9a9b3', fontSize: 13, marginBottom: 16},
  input: {
    minHeight: 88,
    maxHeight: 160,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f5e6d3',
    backgroundColor: '#1c1c20',
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  btn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#c98d5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnDisabled: {backgroundColor: '#5a4a3b'},
  btnText: {color: '#1a1a1c', fontWeight: '700', fontSize: 15},
  errorBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#3a1a1a',
    borderWidth: 1,
    borderColor: '#8a3a3a',
    marginBottom: 16,
  },
  errorText: {color: '#f5b5b5', fontSize: 13},
  imageWrap: {
    backgroundColor: '#1c1c20',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
  },
  image: {width: '100%', aspectRatio: 1, borderRadius: 10},
  placeholder: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#1c1c20',
    borderRadius: 14,
  },
  placeholderText: {color: '#a9a9b3', marginTop: 12, fontSize: 13},
});
