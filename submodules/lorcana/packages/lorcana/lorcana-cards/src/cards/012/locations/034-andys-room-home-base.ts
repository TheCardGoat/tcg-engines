import type { LocationCard } from "@tcg/lorcana-types";
import { andysRoomHomeBaseI18n } from "./034-andys-room-home-base.i18n";

export const andysRoomHomeBase: LocationCard = {
  id: "iCW",
  canonicalId: "ci_iCW",
  reprints: ["set12-034"],
  cardType: "location",
  name: "Andy's Room",
  version: "Home Base",
  inkType: ["amber"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 34,
  rarity: "rare",
  cost: 3,
  willpower: 8,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ce7d516d02e247edb80360f39baa9dcb",
  },
  text: [
    {
      title: "ANDY'S FAVORITE",
      description: "While you have only 1 character here, they get +2 {W} and +1 {L}.",
    },
  ],
  abilities: [
    {
      id: "iCW-1",
      name: "ANDY'S FAVORITE",
      text: "ANDY'S FAVORITE While you have only 1 character here, they get +2 {W} and +1 {L}.",
      type: "static",
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
          ],
        },
        comparison: {
          operator: "eq",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
    {
      id: "iCW-2",
      name: "ANDY'S FAVORITE",
      text: "ANDY'S FAVORITE While you have only 1 character here, they get +2 {W} and +1 {L}.",
      type: "static",
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
          ],
        },
        comparison: {
          operator: "eq",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
  ],
  i18n: andysRoomHomeBaseI18n,
};
