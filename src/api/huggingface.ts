import {HF_CHAT_URL, HF_IMAGE_BASE_URL} from '../config';
import type {ChatMessage} from '../storage/memory';

export type ChatOptions = {
  token: string;
  model: string;
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
};

/**
 * Appelle Hugging Face Chat Completions (OpenAI-compatible).
 * Retourne la réponse texte de l'assistant.
 */
export async function chatCompletion(opts: ChatOptions): Promise<string> {
  const {token, model, systemPrompt, history, userMessage} = opts;

  const messages = [
    {role: 'system', content: systemPrompt},
    ...history
      .filter(m => m.role !== 'system')
      .slice(-20)
      .map(m => ({role: m.role, content: m.content})),
    {role: 'user', content: userMessage},
  ];

  const res = await fetch(HF_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 512,
      temperature: 0.7,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Chat HF ${res.status}: ${text.slice(0, 200)}`);
  }

  const data: any = await res.json();
  const content =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.delta?.content ??
    '';
  if (!content) {
    throw new Error('Réponse vide du modèle.');
  }
  return String(content).trim();
}

/**
 * Génère une image via Hugging Face Inference API.
 * Retourne un data URI base64 (data:image/png;base64,...) prêt à afficher dans <Image />.
 */
export async function generateImage(opts: {
  token: string;
  model: string;
  prompt: string;
}): Promise<string> {
  const {token, model, prompt} = opts;

  const url = `${HF_IMAGE_BASE_URL}/${model}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'image/png',
    },
    body: JSON.stringify({
      inputs: prompt,
      options: {wait_for_model: true},
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Image HF ${res.status}: ${text.slice(0, 200)}`);
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  if (contentType.startsWith('application/json')) {
    const j = await res.json().catch(() => ({}));
    throw new Error(`Image HF erreur: ${JSON.stringify(j).slice(0, 200)}`);
  }

  const buf = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buf);
  return `data:${contentType};base64,${base64}`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)) as unknown as number[],
    );
  }
  // eslint-disable-next-line no-undef
  return global.btoa ? global.btoa(binary) : base64FromBinary(binary);
}

function base64FromBinary(binary: string): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let i = 0;
  while (i < binary.length) {
    const b1 = binary.charCodeAt(i++) & 0xff;
    const b2 = i < binary.length ? binary.charCodeAt(i++) & 0xff : NaN;
    const b3 = i < binary.length ? binary.charCodeAt(i++) & 0xff : NaN;
    const e1 = b1 >> 2;
    const e2 = ((b1 & 3) << 4) | (b2 >> 4);
    const e3 = isNaN(b2) ? 64 : ((b2 & 15) << 2) | (b3 >> 6);
    const e4 = isNaN(b3) ? 64 : b3 & 63;
    output +=
      chars.charAt(e1) +
      chars.charAt(e2) +
      (e3 === 64 ? '=' : chars.charAt(e3)) +
      (e4 === 64 ? '=' : chars.charAt(e4));
  }
  return output;
}
