import type { LocationCard } from "@tcg/lorcana-types";
import { scroogesCountingHouseEbenezersOfficeI18n } from "./134-scrooges-counting-house-ebenezers-office.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const scroogesCountingHouseEbenezersOffice: LocationCard = {
  id: "Qwc",
  canonicalId: "ci_Qwc",
  reprints: ["set11-134"],
  cardType: "location",
  name: "Scrooge's Counting House",
  version: "Ebenezer's Office",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 2,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_889f6b26a5a746d6a6cbe4139412855a",
    tcgPlayer: 676216,
  },
  text: [
    {
      title: "Boost 2 {I}",
      description:
        "(Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this location.)",
    },
    {
      title: "Good Business This location gets +1 {W} and +1 {L} for each card under it.",
    },
  ],
  abilities: [
    boost(2),
    {
      id: "v62-2",
      effect: {
        modifier: {
          type: "cards-under-self",
        },
        stat: "willpower",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "Good Business This location gets +1 {W} and +1 {L} for each card under it.",
    },
    {
      id: "v62-3",
      effect: {
        modifier: {
          type: "cards-under-self",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      type: "static",
      text: "Good Business This location gets +1 {W} and +1 {L} for each card under it.",
    },
  ],
  i18n: scroogesCountingHouseEbenezersOfficeI18n,
};
