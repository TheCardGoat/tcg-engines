import type { ActionCard } from "@tcg/lorcana-types";
import { trialsAndTribulationsI18n } from "./043-trials-and-tribulations.i18n";

export const trialsAndTribulations: ActionCard = {
  id: "yHH",
  canonicalId: "ci_yHH",
  reprints: ["set8-043"],
  cardType: "action",
  name: "Trials and Tribulations",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "008",
  cardNumber: 43,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0194ae6591894265a420ae3e50f6a355",
    tcgPlayer: 631381,
  },
  text: "Chosen character gets -4 {S} until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -4,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1o4-1",
      text: "Chosen character gets -4 {S} until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: trialsAndTribulationsI18n,
};
