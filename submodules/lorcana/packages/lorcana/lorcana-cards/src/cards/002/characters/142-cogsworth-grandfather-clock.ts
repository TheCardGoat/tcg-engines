import type { CharacterCard } from "@tcg/lorcana-types";
import { cogsworthGrandfatherClockI18n } from "./142-cogsworth-grandfather-clock.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { ward } from "../../../helpers/abilities/ward";

export const cogsworthGrandfatherClock: CharacterCard = {
  id: "oib",
  canonicalId: "ci_oib",
  reprints: ["set2-142"],
  cardType: "character",
  name: "Cogsworth",
  version: "Grandfather Clock",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 142,
  rarity: "common",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d98a2d4cddac4630b7e3364443381093",
    tcgPlayer: 517595,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Ward",
    },
    {
      title: "UNWIND",
      description: "Your other characters gain Resist +1",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(3),
    ward,
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "184-3",
      name: "UNWIND",
      text: "UNWIND Your other characters gain Resist +1",
      type: "static",
    },
  ],
  i18n: cogsworthGrandfatherClockI18n,
};
