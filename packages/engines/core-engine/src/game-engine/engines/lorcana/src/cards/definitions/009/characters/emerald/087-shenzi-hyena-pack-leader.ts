import { shenziHyenaPackLeader as shenziHyenaPackLeaderAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const shenziHyenaPackLeader: LorcanaCharacterCardDefinition = {
  ...shenziHyenaPackLeaderAsOrig,
  id: "bh1",
  reprints: [shenziHyenaPackLeaderAsOrig.id],
  number: 87,
  set: "009",
};
