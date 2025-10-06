import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarMastermind: LorcanaCharacterCardDefinition = {
  id: "l2a",
  name: "Scar",
  title: "Mastermind",
  characteristics: ["storyborn", "villain"],
  text: "**Insidious plot** When you play this character, chosen opposing character gets -5 {S} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Insidious plot",
      text: "When you play this character, chosen opposing character gets -5 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 5,
          modifier: "subtract",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "opponent" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: '"The best plans involve a little danger. Just not for me."',
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  illustrator: "Bill Robinson",
  number: 158,
  set: "TFC",
  rarity: "rare",
};
