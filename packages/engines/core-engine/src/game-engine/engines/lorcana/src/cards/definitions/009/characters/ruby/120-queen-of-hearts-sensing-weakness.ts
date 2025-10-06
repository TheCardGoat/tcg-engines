import { queenOfHeartsSensingWeakness as ogQueenOfHeartsSensingWeakness } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/120-queen-of-hearts-sensing-weakness";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsSensingWeakness: LorcanitoCharacterCardDefinition = {
  ...ogQueenOfHeartsSensingWeakness,
  id: "a6w",
  reprints: [ogQueenOfHeartsSensingWeakness.id],
  number: 120,
  set: "009",
};
