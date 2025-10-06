import { wheneverYouPlayAFloodBorn } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const honestJohnNotThatHonest: LorcanitoCharacterCardDefinition = {
  id: "hkq",

  name: "Honest John",
  title: "Not That Honest",
  characteristics: ["storyborn", "villain"],
  text: "**EASY STREET** Whenever you play a Floodborn character, each opponent loses 1 lore.",
  type: "character",
  abilities: [
    wheneverYouPlayAFloodBorn({
      name: "Easy Street",
      text: "Whenever you play a Floodborn character, each opponent loses 1 lore.",
      effects: [
        {
          type: "lore",
          amount: 1,
          modifier: "subtract",
          target: {
            type: "player",
            value: "opponent",
          },
        },
      ],
    }),
  ],
  flavour: "A thing like that ought to be worth a fortune to someone!",
  colors: ["ruby"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Sandra Rios",
  number: 109,
  set: "ROF",
  rarity: "rare",
};
