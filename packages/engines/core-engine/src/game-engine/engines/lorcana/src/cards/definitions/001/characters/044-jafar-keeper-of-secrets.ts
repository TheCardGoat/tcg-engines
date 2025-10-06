import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarKeeperOfSecrets: LorcanitoCharacterCardDefinition = {
  id: "rau",
  reprints: ["f6f"],
  name: "Jafar",
  title: "Keeper of Secrets",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Hidden Wonders",
      text: "This character gets +1 {S} for each card in your hand.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: {
            dynamic: true,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  flavour: "There's more than one way to bury secrets.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  willpower: 5,
  strength: 0,
  lore: 2,
  illustrator: "Marcel Berg",
  number: 44,
  set: "TFC",
  rarity: "rare",
};
