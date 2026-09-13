import { expect } from "vite-plus/test";
import type { GundamPlayerActions } from "@tcg/gundam-engine";
import { expectSuccess } from "@tcg/gundam-engine";

export function acceptDevelopment(
  player: GundamPlayerActions,
  developmentCardIds: readonly string[],
): void {
  const developmentChoice = player.getBoardView().pendingChoice;
  if (developmentChoice?.kind !== "targetSelection") {
    throw new Error("Expected the Development target selection");
  }
  expect(developmentChoice).toMatchObject({
    kind: "targetSelection",
    optionalDirectiveIndex: developmentChoice.directiveIndex,
    legalTargetIds: developmentCardIds,
    minTargets: developmentCardIds.length,
    maxTargets: developmentCardIds.length,
  });
  expectSuccess(
    player.resolveEffect({
      optionalAnswers: { [developmentChoice.directiveIndex]: true },
      targets: [...developmentCardIds],
    }),
  );
}

export function expectDevelopmentExiled(
  player: GundamPlayerActions,
  developmentCardIds: readonly string[],
): void {
  for (const cardId of developmentCardIds) expect(player.getCardZone(cardId)).toBe("removalArea");
}
