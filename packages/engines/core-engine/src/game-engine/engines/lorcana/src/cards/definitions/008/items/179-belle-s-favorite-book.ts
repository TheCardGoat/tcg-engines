import { putTopCardOfYourDeckIntoYourInkwellExerted } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bellesFavoriteBook: LorcanaItemCardDefinition = {
  id: "yy4",
  name: "Belle's Favorite Book",
  characteristics: ["item"],
  text: "CHAPTER THREE {E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "CHAPTER THREE",
      text: "{E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.",
      costs: [
        { type: "exert" },
        {
          type: "card",
          action: "banish",
          amount: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "item" },
          ],
        },
      ],
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
    },
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Edgar Pasten",
  number: 179,
  set: "008",
  rarity: "rare",
};
