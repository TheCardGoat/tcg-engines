import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dopeyAlwaysPlayful: LorcanaCharacterCardDefinition = {
  id: "zdu",
  name: "Dopey",
  title: "Always Playful",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**ODD ONE OUT** When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "Odd One Out",
      text: "When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["seven dwarfs"] },
            ],
          },
        },
      ],
    }),
  ],
  flavour: "He's a real gem.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 6,
  set: "ROF",
  rarity: "uncommon",
};
