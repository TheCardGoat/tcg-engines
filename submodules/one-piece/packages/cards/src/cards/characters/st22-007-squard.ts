import type { CharacterCard } from "@tcg/op-types";
import { st22Squard007I18n } from "./st22-007-squard.i18n.ts";
export const st22Squard007: CharacterCard = {
  id: "ST22-007",
  canonicalId: "ST22-007",
  slug: "squard/st22-007",
  name: "Squard",
  printings: [
    {
      id: "ST22-007",
      artId: "ST22-007",
      setCode: "ST22",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-007.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  effect:
    '[Activate: Main] [Once Per Turn] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", give up to 1 rested DON!! card to your Leader or 1 of your Characters.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
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
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st22Squard007I18n,
};
