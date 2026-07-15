import type {
  AgentChatRequest,
  AgentChatResponse,
  AgentMessage,
  AgentProvider,
  AgentProviderId,
  AgentToolCall,
  AgentToolChoice,
  AgentToolDefinition,
} from "../types";

/**
 * Base OpenAI-compatible chat-completions provider. Zhipu and DeepSeek both
 * expose the same tool-calling wire format, so the only per-provider state is
 * the base URL, the API key, and the default model.
 *
 * No retries here — the runner owns the budget; if the provider call times
 * out or errors, the runner falls back to heuristic.
 */
export interface OpenAICompatibleConfig {
  id: AgentProviderId;
  baseUrl: string;
  apiKey: string;
  defaultModel: string | undefined;
}

interface OpenAIChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ReadonlyArray<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

interface OpenAIToolSpec {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

type OpenAIToolChoice =
  | "auto"
  | "required"
  | "none"
  | { type: "function"; function: { name: string } };

interface OpenAIChatCompletionResponse {
  choices?: ReadonlyArray<{
    message?: OpenAIChatMessage;
  }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

function toOpenAIMessages(messages: ReadonlyArray<AgentMessage>): OpenAIChatMessage[] {
  return messages.map((msg): OpenAIChatMessage => {
    switch (msg.role) {
      case "system":
        return { role: "system", content: msg.content };
      case "user":
        return { role: "user", content: msg.content };
      case "assistant":
        return {
          role: "assistant",
          content: msg.content,
          tool_calls: msg.toolCalls?.map((call) => ({
            id: call.id,
            type: "function" as const,
            function: { name: call.name, arguments: call.arguments },
          })),
        };
      case "tool":
        return { role: "tool", content: msg.content, tool_call_id: msg.toolCallId };
    }
  });
}

function toOpenAITools(tools: ReadonlyArray<AgentToolDefinition>): OpenAIToolSpec[] {
  return tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

function toOpenAIToolChoice(choice: AgentToolChoice): OpenAIToolChoice {
  if (choice === "auto" || choice === "required" || choice === "none") return choice;
  if ("tool" in choice) {
    return { type: "function", function: { name: choice.tool } };
  }
  // `oneOf` has no native OpenAI mapping; the runner enforces this via the
  // forced first call followed by a `required` second call. The provider just
  // sees `required` here and the runner validates the chosen tool against
  // the oneOf list when interpreting the response.
  return "required";
}

function parseAssistantMessage(raw: OpenAIChatMessage | undefined): {
  content: string | null;
  toolCalls?: AgentToolCall[];
} {
  if (!raw) return { content: null };
  const toolCalls = raw.tool_calls?.map(
    (tc): AgentToolCall => ({
      id: tc.id,
      name: tc.function.name,
      arguments: tc.function.arguments,
    }),
  );
  return {
    content: raw.content ?? null,
    toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
  };
}

export class OpenAICompatibleProvider implements AgentProvider {
  readonly id: AgentProviderId;
  readonly defaultModel: string | undefined;
  readonly #baseUrl: string;
  readonly #apiKey: string;

  constructor(config: OpenAICompatibleConfig) {
    this.id = config.id;
    this.defaultModel = config.defaultModel;
    this.#baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.#apiKey = config.apiKey;
  }

  async chat(request: AgentChatRequest): Promise<AgentChatResponse> {
    const model = request.model ?? this.defaultModel;
    if (!model) {
      throw new Error(
        `Agent provider "${this.id}" has no model configured (set a default model or pass request.model).`,
      );
    }

    const messages: OpenAIChatMessage[] = [];
    if (request.system) messages.push({ role: "system", content: request.system });
    messages.push(...toOpenAIMessages(request.messages));

    const body = {
      model,
      messages,
      tools: toOpenAITools(request.tools),
      tool_choice: toOpenAIToolChoice(request.toolChoice),
    };

    const response = await fetch(`${this.#baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.#apiKey}`,
      },
      body: JSON.stringify(body),
      signal: request.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<unreadable response body>");
      throw new Error(
        `Agent provider "${this.id}" failed: HTTP ${response.status} ${response.statusText} — ${text.slice(0, 300)}`,
      );
    }

    const json = (await response.json()) as OpenAIChatCompletionResponse;
    const firstChoice = json.choices?.[0];
    const parsed = parseAssistantMessage(firstChoice?.message);

    return {
      message: {
        role: "assistant",
        content: parsed.content,
        toolCalls: parsed.toolCalls,
      },
      tokensIn: json.usage?.prompt_tokens,
      tokensOut: json.usage?.completion_tokens,
    };
  }
}
