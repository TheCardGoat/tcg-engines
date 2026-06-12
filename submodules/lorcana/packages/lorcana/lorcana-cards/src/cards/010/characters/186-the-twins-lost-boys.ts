import type { CharacterCard } from "@tcg/lorcana-types";
import { theTwinsLostBoysI18n } from "./186-the-twins-lost-boys.i18n";

export const theTwinsLostBoys: CharacterCard = {
  id: "Lqt",
  canonicalId: "ci_Lqt",
  reprints: ["set10-186"],
  cardType: "character",
  name: "The Twins",
  version: "Lost Boys",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 186,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_171e6569a06946a89dcc64afdd1585c7",
    tcgPlayer: 659409,
  },
  text: [
    {
      title: "TWO FOR ONE",
      description:
        "When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-location-in-play",
        controller: "you",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "hrd-1",
      name: "TWO FOR ONE",
      text: "TWO FOR ONE When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: theTwinsLostBoysI18n,
};
