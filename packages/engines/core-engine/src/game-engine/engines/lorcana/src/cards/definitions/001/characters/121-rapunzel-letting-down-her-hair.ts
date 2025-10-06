import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelLettingHerHairDown: LorcanaCharacterCardDefinition = {
  id: "eqs",
  reprints: ["aq6"],

  name: "Rapunzel",
  title: "Letting Down Her Hair",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Tangle",
      text: "When you play this character, each opponent loses 1 lore.",
      effects: [
        {
          type: "lore",
          modifier: "subtract",
          amount: 1,
          target: {
            type: "player",
            value: "opponent",
          },
        } as LoreEffect,
      ],
    }),
  ],
  flavour: "Who are you? And how did you find me?",
  colors: ["ruby"],
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  illustrator: "Clio Wolfensberger",
  number: 121,
  set: "TFC",
  rarity: "uncommon",
};
