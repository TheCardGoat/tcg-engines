import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const falinePlayfulFawn: LorcanaCharacterCardDefinition = {
  id: "ld7",
  name: "Faline",
  title: "Playful Fawn",
  characteristics: ["storyborn", "ally"],
  text: "Evasive\nPRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
  type: "character",
  abilities: [
    evasiveAbility,
    whileConditionThisCharacterGets({
      name: "PRECOCIOUS FRIEND",
      text: "While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
      conditions: [{ type: "have-strongest-character" }],
      effects: [thisCharacterGetsLore(2)],
    }),
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Raquel Villanueva",
  number: 145,
  set: "008",
  rarity: "rare",
  lore: 1,
};
