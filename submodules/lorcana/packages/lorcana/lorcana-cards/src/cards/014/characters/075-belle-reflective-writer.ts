import type { CharacterCard } from "@tcg/lorcana-types";
import { belleReflectiveWriterI18n } from "./075-belle-reflective-writer.i18n";

export const belleReflectiveWriter: CharacterCard = {
  id: "cSM",
  canonicalId: "ci_cSM",
  slug: "lorcana-ci_cSM",
  printings: [
    {
      id: "set14-075",
      artId: "set14-075",
      setCode: "set14",
      collectorNumber: "75",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-075"],
  cardType: "character",
  name: "Belle",
  version: "Reflective Writer",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "014",
  cardNumber: 75,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_602ea44401b44af8a92b674bdbbe48ff",
  },
  text: [
    {
      title: "CITY ADVENTURES",
      description:
        "When you play this character, reveal the top card of your deck. If it's an item card named Belle's City Guide or an action card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "cSM-1",
      name: "CITY ADVENTURES",
      type: "triggered",
      text: "CITY ADVENTURES When you play this character, reveal the top card of your deck. If it's an item card named Belle's City Guide or an action card, you may put it into your hand. Otherwise, put it on the bottom of your deck.",
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
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "item",
                    },
                    {
                      type: "has-name",
                      name: "Belle's City Guide",
                    },
                  ],
                },
                {
                  type: "card-type",
                  cardType: "action",
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: belleReflectiveWriterI18n,
};
