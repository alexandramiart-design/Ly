/**
 * Lyra - Configuration
 *
 * Ce fichier contient les paramètres par défaut de l'application.
 * Le token Hugging Face et les modèles peuvent être modifiés ici,
 * ou changés depuis l'écran "Paramètres" à l'exécution (persistés via AsyncStorage).
 */

export const DEFAULT_HF_TOKEN =
  '';

// Modèle de chat (OpenAI-compatible via router Hugging Face)
export const DEFAULT_CHAT_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';

// Modèle image (Inference API classique)
export const DEFAULT_IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell';

// Persona par défaut (Mamie / Grand-mère bienveillante)
export const DEFAULT_SYSTEM_PROMPT =
  "Tu es Lyra, une mamie bienveillante et sage. Tu parles français avec chaleur, tendresse et un peu d'humour. Tu donnes des conseils comme le ferait une grand-mère aimante. Tu tutoies l'utilisateur et l'appelles 'mon petit' ou 'ma petite'. Tes réponses sont courtes, chaleureuses et pleines de bon sens.";

// URLs Hugging Face
export const HF_CHAT_URL = 'https://router.huggingface.co/v1/chat/completions';
export const HF_IMAGE_BASE_URL = 'https://api-inference.huggingface.co/models';
