import type { CharacterCard } from "@tcg/lorcana-types";
import { theMusesProclaimersOfHeroesI18n } from "./090-the-muses-proclaimers-of-heroes.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const theMusesProclaimersOfHeroes: CharacterCard = {
  id: "BQW",
  canonicalId: "ci_BQW",
  reprints: ["set4-090"],
  cardType: "character",
  name: "The Muses",
  version: "Proclaimers of Heroes",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 90,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_12e044565cad4dea9a798105ec0df2f2",
    tcgPlayer: 547727,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "THE GOSPEL TRUTH",
      description:
        "Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    ward,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "strength-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1x8-2",
      name: "THE GOSPEL TRUTH",
      text: "THE GOSPEL TRUTH Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theMusesProclaimersOfHeroesI18n,
};
