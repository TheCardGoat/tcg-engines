import type { CharacterCard } from "@tcg/op-types";
import { st20CharlotteKatakuri001I18n } from "./st20-001-charlotte-katakuri.i18n.ts";
export const st20CharlotteKatakuri001: CharacterCard = {
  id: "ST20-001",
  canonicalId: "ST20-001",
  slug: "charlotte-katakuri/st20-001",
  name: "Charlotte Katakuri",
  printings: [
    {
      id: "ST20-001",
      artId: "ST20-001",
      setCode: "ST20",
      collectorNumber: "001",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST20-001.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST20",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Activate: Main] [Once Per Turn] You may turn 1 card from the top of your Life cards face-up: Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: true,
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
  i18n: st20CharlotteKatakuri001I18n,
};
