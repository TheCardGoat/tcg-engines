import { OpenAICompatibleProvider } from "./openai-compatible";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";

export interface DeepseekProviderConfig {
  apiKey: string;
  defaultModel?: string;
  baseUrl?: string;
}

/**
 * DeepSeek provider. OpenAI-compatible chat-completions API at
 * `api.deepseek.com/v1`. Default model is read from `DEEPSEEK_DEFAULT_MODEL`
 * at the caller side.
 */
export function createDeepseekProvider(config: DeepseekProviderConfig): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "deepseek",
    baseUrl: config.baseUrl ?? DEEPSEEK_BASE_URL,
    apiKey: config.apiKey,
    defaultModel: config.defaultModel,
  });
}
