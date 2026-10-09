import type { CharacterCard } from "@tcg/op-types";
import { st29RoronoaZoro014I18n } from "./st29-014-roronoa-zoro.i18n.ts";
export const st29RoronoaZoro014: CharacterCard = {
  id: "ST29-014",
  canonicalId: "ST29-014",
  slug: "roronoa-zoro/st29-014",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "ST29-014",
      artId: "ST29-014",
      setCode: "ST29",
      collectorNumber: "014",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-014.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST29",
  cost: 6,
  power: 8000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.) [Activate: Main] [Once Per Turn] You may trash 1 card with a [Trigger] from your hand: Draw 1 card and give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
  i18n: st29RoronoaZoro014I18n,
};
