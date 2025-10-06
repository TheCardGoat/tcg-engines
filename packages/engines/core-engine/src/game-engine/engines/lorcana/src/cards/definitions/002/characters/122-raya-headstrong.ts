import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverBanishesAnotherCharacterInChallenge } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaHeadstrong: LorcanaCharacterCardDefinition = {
  id: "a5t",
  reprints: ["g6t"],
  name: "Raya",
  title: "Headstrong",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**NOTE TO SELF, DON’T DIE** During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.",
  type: "character",
  abilities: [
    wheneverBanishesAnotherCharacterInChallenge({
      name: "Note to Self, Don't Die",
      text: "During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.",
      effects: [
        ...readyAndCantQuest({
          type: "card",
          value: "all",
          filters: [{ filter: "source", value: "self" }],
        }),
      ],
    }),
  ],
  flavour:
    "Two parts bravery, one part cleverness, and a whole lot of determination.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Amber Kommavongsa",
  number: 122,
  set: "ROF",
  rarity: "common",
};
