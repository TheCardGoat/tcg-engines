import type { ItemCard } from "@tcg/lorcana-types";
import { chemPurseI18n } from "./119-chem-purse.i18n";

export const chemPurse: ItemCard = {
  id: "VyL",
  canonicalId: "ci_VyL",
  reprints: ["set8-119"],
  cardType: "item",
  name: "Chem Purse",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 119,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_537258cef9b5410fafafa47026feedf6",
    tcgPlayer: 631428,
  },
  text: [
    {
      title: "HERE'S THE BEST PART",
      description:
        "Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
    },
  ],
  abilities: [
    {
      id: "1ea-1",
      name: "HERE'S THE BEST PART",
      text: "HERE'S THE BEST PART Whenever you play a character, if you used Shift to play them, they get +4 {S} this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      condition: {
        type: "play-context",
        context: "used-shift",
      },
      effect: {
        duration: "this-turn",
        modifier: 4,
        stat: "strength",
        target: {
          selector: "all",
          count: 1,
          reference: "trigger-subject",
        },
        type: "modify-stat",
      },
    },
  ],
  i18n: chemPurseI18n,
};
