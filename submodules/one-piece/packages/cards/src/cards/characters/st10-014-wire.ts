import type { CharacterCard } from "@tcg/op-types";
import { st10Wire014I18n } from "./st10-014-wire.i18n.ts";
export const st10Wire014: CharacterCard = {
  id: "ST10-014",
  canonicalId: "ST10-014",
  slug: "wire/st10-014",
  name: "Wire",
  printings: [
    {
      id: "ST10-014",
      artId: "ST10-014",
      setCode: "ST10",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-014.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, draw 1 card and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenDonReturned",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st10Wire014I18n,
};
