import { ticktockEverpresentPursuer as ogTickTockEverPresentPursuer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/056-tick-tock-ever-present-pursuer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ticktockEverpresentPursuer: LorcanaCharacterCardDefinition = {
  ...ogTickTockEverPresentPursuer,
  id: "znh",
  reprints: [ogTickTockEverPresentPursuer.id],
  number: 50,
  set: "009",
};
