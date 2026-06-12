const QUICK_AI_PLAY_PATH = "/sandbox/simulator/vs-ai/quick";

export interface AiQuickPlayUrlOptions {
  deckText: string;
  opponentFixtureId?: string;
  strategyId?: string;
}

export function encodeDeckTextForAiQuickPlay(deckText: string): string {
  if (typeof globalThis.btoa === "function") {
    const utf8Bytes = new TextEncoder().encode(deckText);
    const binary = String.fromCharCode(...utf8Bytes);
    return globalThis.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return Buffer.from(deckText, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function buildAiQuickPlayUrl(deckText: string): string;
export function buildAiQuickPlayUrl(options: AiQuickPlayUrlOptions): string;
export function buildAiQuickPlayUrl(optionsOrDeckText: string | AiQuickPlayUrlOptions): string {
  const options =
    typeof optionsOrDeckText === "string" ? { deckText: optionsOrDeckText } : optionsOrDeckText;

  const params = new URLSearchParams({
    deck: encodeDeckTextForAiQuickPlay(options.deckText),
  });

  if (options.opponentFixtureId?.trim()) {
    params.set("opponentFixtureId", options.opponentFixtureId.trim());
  }

  if (options.strategyId?.trim()) {
    params.set("strategyId", options.strategyId.trim());
  }

  return `${QUICK_AI_PLAY_PATH}?${params.toString()}`;
}
