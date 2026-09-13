export interface AgentReplayContext {
  selectedWindow: {
    anchorStep: number;
  };
}

export interface AgentReplayContextWindow {
  before?: number;
  after?: number;
}

export class AgentReplayContextNotFoundError extends Error {
  constructor(public readonly gameId: string) {
    super(`Agent replay context not found for gameId=${gameId}`);
    this.name = "AgentReplayContextNotFoundError";
  }
}

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function agentContextUrl(
  replayId: string,
  turn: number,
  apiOrigin: string,
  format: "json" | "markdown",
  window: AgentReplayContextWindow,
): string {
  const url = new URL(
    `/v1/play/replays/${encodeURIComponent(replayId)}/agent-context`,
    `${apiOrigin.replace(/\/$/, "")}/`,
  );
  url.searchParams.set("turn", String(turn));
  url.searchParams.set("format", format);
  if (window.before !== undefined) {
    url.searchParams.set("before", String(window.before));
  }
  if (window.after !== undefined) {
    url.searchParams.set("after", String(window.after));
  }
  return url.toString();
}

async function fetchAgentReplayContextResponse(
  replayId: string,
  turn: number,
  apiOrigin: string,
  token: string,
  format: "json" | "markdown",
  window: AgentReplayContextWindow,
  fetchImpl: FetchLike,
): Promise<Response> {
  const response = await fetchImpl(agentContextUrl(replayId, turn, apiOrigin, format, window), {
    headers: { "x-agent-replay-token": token },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status === 404) {
    throw new AgentReplayContextNotFoundError(replayId);
  }
  if (!response.ok) {
    throw new Error(
      `Failed to fetch persisted agent replay context (${response.status} ${response.statusText})`,
    );
  }
  return response;
}

export async function fetchAgentReplayContext(
  replayId: string,
  turn: number,
  apiOrigin: string,
  token: string,
  window: AgentReplayContextWindow = {},
  fetchImpl: FetchLike = fetch,
): Promise<AgentReplayContext> {
  const response = await fetchAgentReplayContextResponse(
    replayId,
    turn,
    apiOrigin,
    token,
    "json",
    window,
    fetchImpl,
  );
  return (await response.json()) as AgentReplayContext;
}

export async function fetchAgentReplayContextMarkdown(
  replayId: string,
  turn: number,
  apiOrigin: string,
  token: string,
  window: AgentReplayContextWindow = {},
  fetchImpl: FetchLike = fetch,
): Promise<string> {
  const response = await fetchAgentReplayContextResponse(
    replayId,
    turn,
    apiOrigin,
    token,
    "markdown",
    window,
    fetchImpl,
  );
  return response.text();
}
