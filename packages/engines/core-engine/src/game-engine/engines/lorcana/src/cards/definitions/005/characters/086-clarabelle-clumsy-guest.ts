import { banishChosenItem } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const clarabelleClumsyGuest: LorcanaCharacterCardDefinition = {
  id: "ws8",
  missingTestCase: true,
  name: "Clarabelle",
  title: "Clumsy Guest",
  characteristics: ["storyborn", "ally"],
  text: "**BUTTERFINGER** When you play this character, you may pay to 2 {I} to banish chosen item.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      name: "BUTTERFINGER",
      text: "When you play this character, you may pay to 2 {I} to banish chosen item.",
      effects: [banishChosenItem],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 86,
  set: "SSK",
  rarity: "common",
};
