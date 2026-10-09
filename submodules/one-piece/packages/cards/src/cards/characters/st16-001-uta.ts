import type { CharacterCard } from "@tcg/op-types";
import { st16Uta001I18n } from "./st16-001-uta.i18n.ts";
export const st16Uta001: CharacterCard = {
  id: "ST16-001",
  canonicalId: "ST16-001",
  slug: "uta/st16-001",
  name: "Uta",
  printings: [
    {
      id: "ST16-001",
      artId: "ST16-001",
      setCode: "ST16",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST16-001.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST16",
  cost: 4,
  traits: ["FILM"],
  power: 6000,
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Activate: Main] [Once Per Turn] You may trash 1 {FILM} type card from your hand: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "FILM",
                match: "exact",
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
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st16Uta001I18n,
};
