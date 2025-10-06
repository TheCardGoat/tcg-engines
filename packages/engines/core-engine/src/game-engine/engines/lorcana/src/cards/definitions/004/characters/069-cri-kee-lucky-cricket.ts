import { yourOtherCharactersGainStrengthThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const criKeeLuckyCricket: LorcanaCharacterCardDefinition = {
  id: "ep2",
  missingTestCase: true,
  name: "Cri-Kee",
  title: "Lucky Cricket",
  characteristics: ["storyborn", "ally"],
  text: "**SPREADING GOOD FORTUNE** When you play this character, your other characters get +3 {S} this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Spreading Good Fortune",
      text: "When you play this character, your other characters get +3 {S} this turn.",
      effects: [yourOtherCharactersGainStrengthThisTurn(3)],
    },
  ],
  flavour: "Everyone feels better just knowing he's around.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 3,
  illustrator: "Heidi Neunhoffer",
  number: 69,
  set: "URR",
  rarity: "rare",
};
