import { robinHoodCapableFighter as ogRobinHoodCapableFighter } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/193-robin-hood-capable-fighter";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodCapableFighter: LorcanitoCharacterCardDefinition = {
  ...ogRobinHoodCapableFighter,
  id: "kjo",
  reprints: [ogRobinHoodCapableFighter.id],
  number: 184,
  set: "009",
};
