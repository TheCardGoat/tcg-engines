import type { LiveMatchSidebarParticipant } from "./components/BoardRuntimeContext";

/** Viewer-safe bootstraps omit userId, so the explicit bot marker owns classification. */
export function isRealHumanParticipant(participant: LiveMatchSidebarParticipant): boolean {
  return participant.isBot !== true && !participant.id.startsWith("bot_");
}
