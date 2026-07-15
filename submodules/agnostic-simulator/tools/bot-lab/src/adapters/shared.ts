import {
  BOT_CORE_SCHEMA_VERSION,
  canonicalJson,
  type BotPromotionRecordV1,
  type BotStrategyDescriptorV1,
} from "@tcg/bot-core";

export function strategyDescriptor(
  input: Omit<BotStrategyDescriptorV1, "schemaVersion">,
): BotStrategyDescriptorV1 {
  return { schemaVersion: BOT_CORE_SCHEMA_VERSION, ...input };
}

export function promotionWrite(path: string, record: BotPromotionRecordV1) {
  return [{ path, content: canonicalJson(record) }] as const;
}

export function candidateWinner(input: {
  readonly winnerIsP1: boolean | null;
  readonly candidateSeat: "p1" | "p2";
}): "candidate" | "baseline" | null {
  if (input.winnerIsP1 === null) return null;
  const winnerSeat = input.winnerIsP1 ? "p1" : "p2";
  return winnerSeat === input.candidateSeat ? "candidate" : "baseline";
}
