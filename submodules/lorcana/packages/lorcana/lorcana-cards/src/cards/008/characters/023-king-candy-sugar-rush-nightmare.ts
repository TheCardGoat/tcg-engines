import type { CharacterCard } from "@tcg/lorcana-types";
import { kingCandySugarRushNightmareI18n } from "./023-king-candy-sugar-rush-nightmare.i18n";

export const kingCandySugarRushNightmare: CharacterCard = {
  id: "ABb",
  canonicalId: "ci_ABb",
  reprints: ["set8-023"],
  cardType: "character",
  name: "King Candy",
  version: "Sugar Rush Nightmare",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  cardNumber: 23,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c7f64e55e7234c46bc9ed7d742e22265",
    tcgPlayer: 631367,
  },
  text: [
    {
      title: "A NEW ROSTER",
      description:
        "When this character is banished, you may return another Racer character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Racer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
            excludeSelf: true,
            filter: [
              {
                type: "has-classification",
                classification: "Racer",
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1mh-1",
      name: "A NEW ROSTER",
      text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kingCandySugarRushNightmareI18n,
};
