import type { CharacterCard } from "@tcg/op-types";
import { op14eb04GorgonSisters105I18n } from "./105-gorgon-sisters.i18n.ts";

export const op14eb04GorgonSisters105: CharacterCard = {
  id: "OP14-105",
  canonicalId: "OP14-105",
  slug: "gorgon-sisters/op14-105",
  name: "Gorgon Sisters",
  printings: [
    {
      id: "OP14-105",
      artId: "OP14-105",
      setCode: "OP14EB04",
      collectorNumber: "105",
      rarity: "UC",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/OP14-105.png?260715",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 6,
  power: 5000,
  counter: 2000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  attribute: ["slash", "special"],
  effect:
    "[Activate: Main] [Once Per Turn] You may reveal 3 {Amazon Lily} or {Kuja Pirates} type cards from your hand: Give your Leader and all of your Characters up to 1 rested DON!! card each.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "revealFromHand",
            amount: 3,
            filters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Amazon Lily" },
                  { filter: "trait", value: "Kuja Pirates" },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: "all" },
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        conditions: [{ condition: "leaderTrait", trait: "Kuja Pirates" }],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1 },
            self: true,
          },
        ],
      },
    ],
  },
  i18n: op14eb04GorgonSisters105I18n,
};
