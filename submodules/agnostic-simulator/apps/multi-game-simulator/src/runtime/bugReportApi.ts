import type { GameSlug } from "@tcg/simulator-contract";

import { apiUrl } from "./gameRuntimeApi.ts";

export interface BugReportContext {
  readonly gameId?: string;
  readonly gameSlug: GameSlug;
  readonly matchId?: string;
  readonly playerCount?: number;
  readonly turn?: number;
  readonly stateVersion?: number;
  readonly replayCursor?: number;
  readonly platform?: "mobile" | "desktop";
}

export interface BugReportSubmissionResult {
  readonly id: string;
  readonly createdAt: string;
}

export function buildBugReportContext(input: BugReportContext): BugReportContext {
  return {
    gameSlug: input.gameSlug,
    ...(input.gameId ? { gameId: input.gameId } : {}),
    ...(input.matchId ? { matchId: input.matchId } : {}),
    ...(input.playerCount !== undefined ? { playerCount: input.playerCount } : {}),
    ...(input.turn !== undefined ? { turn: input.turn } : {}),
    ...(input.stateVersion !== undefined ? { stateVersion: input.stateVersion } : {}),
    ...(input.replayCursor !== undefined ? { replayCursor: input.replayCursor } : {}),
    ...(input.platform ? { platform: input.platform } : {}),
  };
}

export async function submitBugReport(
  input: {
    readonly description: string;
    readonly source?: string;
    readonly context: BugReportContext;
  },
  fetcher: typeof fetch = fetch,
): Promise<BugReportSubmissionResult> {
  const response = await fetcher(apiUrl(input.context.gameSlug, "/feedback/bug-reports"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      description: input.description,
      source: input.source,
      context: input.context,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit bug report (${response.status}).`);
  }

  return parseSubmissionResult(await response.json());
}

export function buildBugTriageHref(gameSlug: GameSlug, reportId: string): string {
  const configuredOrigin = import.meta.env.VITE_PLATFORM_ORIGIN?.trim();
  const fallbackOrigin =
    typeof window === "undefined" ? "https://tcg.online" : window.location.origin;
  return new URL(
    `/${encodeURIComponent(gameSlug)}/bug-triage/${encodeURIComponent(reportId)}`,
    configuredOrigin || fallbackOrigin,
  ).toString();
}

function parseSubmissionResult(value: unknown): BugReportSubmissionResult {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "string" ||
    !("createdAt" in value) ||
    typeof value.createdAt !== "string"
  ) {
    throw new Error("Bug report response was invalid.");
  }
  return { id: value.id, createdAt: value.createdAt };
}
