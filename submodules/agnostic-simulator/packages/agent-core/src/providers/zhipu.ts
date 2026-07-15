import { OpenAICompatibleProvider } from "./openai-compatible";

const ZHIPU_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";

export interface ZhipuProviderConfig {
  apiKey: string;
  defaultModel?: string;
  baseUrl?: string;
}

/**
 * Zhipu / Z.ai GLM provider. Uses the OpenAI-compatible `/chat/completions`
 * endpoint exposed under `open.bigmodel.cn/api/paas/v4`. Default model is
 * read from `ZHIPU_DEFAULT_MODEL` at the caller side; we keep this class
 * env-free so it can be unit-tested by supplying explicit config.
 */
export function createZhipuProvider(config: ZhipuProviderConfig): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "zhipu",
    baseUrl: config.baseUrl ?? ZHIPU_BASE_URL,
    apiKey: config.apiKey,
    defaultModel: config.defaultModel,
  });
}
