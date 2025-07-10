import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const yokaiIntellectualSchemer: LorcanitoCharacterCard = {
  id: "zdo",
  name: "Yokai",
  title: "Intellectual Schemer",
  characteristics: ["storyborn", "villain", "inventor"],
  text: "INNOVATE You pay 1{I} less to play characters using their Shift ability.",
  type: "character",
  abilities: [
    {
      type: "static",
      name: "INNOVATE",
      text: "You pay 1{I} less to play characters using their Shift ability.",
      ability: "effects",
      conditions: [duringYourTurn],
      effects: [
        {
          type: "replacement",
          replacement: "shift",
          amount: 1,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "sapphire"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Diogo Saito",
  number: 97,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
