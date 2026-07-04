import type { CharacterCard } from "@tcg/lorcana-types";
import { _4townHottestBandOfTheYearI18n } from "./017-4town-hottest-band-of-the-year.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const _4townHottestBandOfTheYear: CharacterCard = {
  id: "iZx",
  canonicalId: "ci_iZx",
  slug: "lorcana-ci_iZx",
  printings: [
    {
      id: "set13-017",
      artId: "set13-017",
      setCode: "set13",
      collectorNumber: "17",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-017"],
  cardType: "character",
  name: "4*Town",
  version: "Hottest Band of the Year",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 17,
  rarity: "rare",
  cost: 4,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_646dc0c6b56d4d72abe97f1d4e813df4",
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "STAR PERFORMANCE",
      description: "Whenever this character sings a song with Sing Together, draw a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    singer(5),
    {
      type: "triggered",
      name: "STAR PERFORMANCE",
      text: "STAR PERFORMANCE Whenever this character sings a song with Sing Together, draw a card.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
        condition: {
          type: "played-card-has-keyword",
          keyword: "SingTogether",
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: _4townHottestBandOfTheYearI18n,
};
