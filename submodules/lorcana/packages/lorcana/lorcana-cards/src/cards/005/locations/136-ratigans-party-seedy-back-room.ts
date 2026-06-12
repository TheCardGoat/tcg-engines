import type { LocationCard } from "@tcg/lorcana-types";
import { ratigansPartySeedyBackRoomI18n } from "./136-ratigans-party-seedy-back-room.i18n";

export const ratigansPartySeedyBackRoom: LocationCard = {
  id: "kAJ",
  canonicalId: "ci_dzD",
  reprints: ["set5-136"],
  cardType: "location",
  name: "Ratigan's Party",
  version: "Seedy Back Room",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 136,
  rarity: "uncommon",
  cost: 2,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_4690391667a14f42a7df8ef76771703d",
    tcgPlayer: 562000,
  },
  text: [
    {
      title: "MISFITS' REVELRY",
      description: "While you have a damaged character here, this location gets +2 {L}.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
            {
              type: "damaged",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1nd-1",
      name: "MISFITS' REVELRY",
      text: "MISFITS' REVELRY While you have a damaged character here, this location gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: ratigansPartySeedyBackRoomI18n,
};
