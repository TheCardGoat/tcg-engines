import type { CharacterCard } from "@tcg/op-types";
import { op07RobLucci093I18n } from "./093-rob-lucci.i18n.ts";

export const op07RobLucci093: CharacterCard = {
  id: "OP07-093",
  canonicalId: "OP07-093",
  slug: "rob-lucci/op07-093",
  name: "Rob Lucci",
  printings: [
    {
      id: "OP07-093",
      artId: "OP07-093",
      setCode: "OP07",
      collectorNumber: "093",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-093.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["CP0"],
  attribute: "strike",
  effect:
    "[On Play] You may place 3 cards from your trash at the bottom of your deck in any order: Your opponent trashes 1 card from their hand. Then, you may place up to 1 card from your opponent's trash at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07RobLucci093I18n,
};
