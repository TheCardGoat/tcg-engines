import { princePhillipVanquisherOfFoes as ogPrincePhillipVanquisherOfFoes } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/087-prince-phillip-vanquisher-of-foes";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipVanquisherOfFoes: LorcanitoCharacterCardDefinition = {
  ...ogPrincePhillipVanquisherOfFoes,
  id: "wj7",
  reprints: [ogPrincePhillipVanquisherOfFoes.id],
  number: 73,
  set: "009",
};
