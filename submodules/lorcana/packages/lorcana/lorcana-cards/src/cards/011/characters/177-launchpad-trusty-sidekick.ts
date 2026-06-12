import type { CharacterCard } from "@tcg/lorcana-types";
import { launchpadTrustySidekickI18n } from "./177-launchpad-trusty-sidekick.i18n";

export const launchpadTrustySidekick: CharacterCard = {
  id: "RLN",
  canonicalId: "ci_RLN",
  reprints: ["set11-177"],
  cardType: "character",
  name: "Launchpad",
  version: "Trusty Sidekick",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 177,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5dd9c7a6d0ca4d4e9b0891adf35e1a99",
    tcgPlayer: 658219,
  },
  text: [
    {
      title: "WHAT DID YOU NEED?",
      description:
        "{E} — Draw a card. Then, choose and discard a card unless you have a character named Darkwing Duck in play.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1ll-1",
      name: "WHAT DID YOU NEED?",
      cost: {
        exert: true,
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            type: "conditional",
            condition: {
              type: "not",
              condition: {
                type: "has-named-character",
                controller: "you",
                name: "Darkwing Duck",
              },
            },
            then: {
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
              type: "discard",
            },
          },
        ],
        type: "sequence",
      },
      type: "activated",
      text: "WHAT DID YOU NEED? {E} - Draw a card. Then, choose and discard a card unless you have a character named Darkwing Duck in play.",
    },
  ],
  i18n: launchpadTrustySidekickI18n,
};
