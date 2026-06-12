import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckCoinCollectorI18n } from "./037-donald-duck-coin-collector.i18n";

export const donaldDuckCoinCollector: CharacterCard = {
  id: "i7B",
  canonicalId: "ci_i7B",
  reprints: ["set8-037"],
  cardType: "character",
  name: "Donald Duck",
  version: "Coin Collector",
  inkType: ["amber"],
  set: "008",
  cardNumber: 37,
  rarity: "common",
  cost: 8,
  strength: 4,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fef2291c6e394415a529772dcda9e9b0",
    tcgPlayer: 631334,
  },
  text: [
    {
      title: "HERE, PIGGY, PIGGY",
      description:
        "For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
    },
    {
      title: "MONEY EVERYWHERE",
      description:
        'When you play this character, your other characters gain "{E} — Draw a card" this turn.',
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "i7B-1",
      name: "HERE, PIGGY, PIGGY",
      text: "HERE, PIGGY, PIGGY For each item named The Nephews' Piggy Bank you have in play, you pay 2 {I} less to play this character.",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "item",
          filters: [
            {
              type: "has-name",
              name: "The Nephews' Piggy Bank",
            },
          ],
          multiplier: 2,
        },
        cardType: "character",
      },
    },
    {
      id: "i7B-2",
      name: "MONEY EVERYWHERE",
      text: 'MONEY EVERYWHERE When you play this character, your other characters gain "{E} — Draw a card" this turn.',
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      effect: {
        type: "grant-ability",
        ability: {
          type: "activated",
          id: "draw-a-card-when-exerted",
          cost: {
            exert: true,
          },
          effect: {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          text: "{E} — Draw a card.",
        },
        duration: "this-turn",
        target: "YOUR_OTHER_CHARACTERS",
      },
    },
  ],
  i18n: donaldDuckCoinCollectorI18n,
};
