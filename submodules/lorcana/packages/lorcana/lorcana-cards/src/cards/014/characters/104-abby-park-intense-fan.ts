import type { CharacterCard } from "@tcg/lorcana-types";
import { abbyParkIntenseFanI18n } from "./104-abby-park-intense-fan.i18n";

export const abbyParkIntenseFan: CharacterCard = {
  id: "2oR",
  canonicalId: "ci_2oR",
  slug: "lorcana-ci_2oR",
  printings: [
    {
      id: "set14-104",
      artId: "set14-104",
      setCode: "set14",
      collectorNumber: "104",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-104"],
  cardType: "character",
  name: "Abby Park",
  version: "Intense Fan",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "014",
  cardNumber: 104,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0929d36ab014cb598cc0282dbd077d7",
  },
  text: [
    {
      title: "DREAM COME TRUE",
      description:
        "When you play this character, reveal the top card of your deck. If it's a character card with Singer or a song card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "abby-1",
      name: "DREAM COME TRUE",
      type: "triggered",
      text: "DREAM COME TRUE When you play this character, reveal the top card of your deck. If it's a character card with Singer or a song card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "scry",
        amount: 1,
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "or",
              filters: [
                { type: "is-song" },
                {
                  type: "and",
                  filters: [
                    { type: "card-type", cardType: "character" },
                    { type: "has-keyword", keyword: "Singer" },
                  ],
                },
              ],
            },
          },
          { zone: "deck-bottom", remainder: true },
        ],
      },
    },
  ],
  i18n: abbyParkIntenseFanI18n,
};
