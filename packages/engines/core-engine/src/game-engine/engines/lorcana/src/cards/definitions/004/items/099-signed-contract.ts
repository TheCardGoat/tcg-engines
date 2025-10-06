import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOpponentPlaysASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const signedContract: LorcanaItemCardDefinition = {
  id: "nxy",
  reprints: ["no1"],
  missingTestCase: true,
  name: "Signed Contract",
  characteristics: ["item"],
  text: "**FINE PRINT** Whenever an opponent plays a song, you may draw a card.",
  type: "item",
  abilities: [
    wheneverOpponentPlaysASong({
      name: "FINE PRINT",
      text: "Whenever an opponent plays a song, you may draw a card.",
      optional: true,
      effects: [drawACard],
    }),
  ],
  flavour:
    '"I Would love to help you, of course, but there\'s the little matter of the contract..."\n−Ursula',
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Andrew Peka",
  number: 99,
  set: "URR",
  rarity: "uncommon",
};
