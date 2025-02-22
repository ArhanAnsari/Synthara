import { togetherai } from '@ai-sdk/togetherai';
import { google } from '@ai-sdk/google';
import { fireworks } from '@ai-sdk/fireworks';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

export const myProvider = customProvider({
  languageModels: {
    "chat-model-small": google("gemini-1.5-flash"),
    "chat-model-large": google('gemini-1.5-pro'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': google('gemini-1.5-flash'),
    'artifact-model': google('gemini-1.5-flash'),
  },
  imageModels: {
    'small-model': togetherai.image('black-forest-labs/FLUX.1-schnell-Free'),
    'large-model': togetherai.image('black-forest-labs/FLUX.1-schnell'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
