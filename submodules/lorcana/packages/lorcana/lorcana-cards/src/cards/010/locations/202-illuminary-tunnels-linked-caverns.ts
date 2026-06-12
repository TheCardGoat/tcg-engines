import type { LocationCard } from "@tcg/lorcana-types";
import { illuminaryTunnelsLinkedCavernsI18n } from "./202-illuminary-tunnels-linked-caverns.i18n";

export const illuminaryTunnelsLinkedCaverns: LocationCard = {
  id: "YpL",
  canonicalId: "ci_YpL",
  reprints: ["set10-202"],
  cardType: "location",
  name: "Illuminary Tunnels",
  version: "Linked Caverns",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 202,
  rarity: "common",
  cost: 3,
  willpower: 6,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f0d2c7f7fb9243bdb38b6c1e5eb522cd",
    tcgPlayer: 658460,
  },
  text: [
    {
      title: "SUBTERRANEAN NETWORK",
      description:
        "While you have a character here, this location gets +1 {L} for each other location you have in play.",
    },
    {
      title: "LOCUS",
      description: "While you have a character here, you pay 1 {I} less to play locations.",
    },
  ],
  abilities: [
    {
      id: "YpL-1",
      name: "SUBTERRANEAN NETWORK",
      text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "location",
          excludeSelf: true,
          filters: [],
        },
        target: "SELF",
      },
    },
    {
      id: "YpL-2",
      name: "LOCUS",
      text: "LOCUS While you have a character here, you pay 1 {I} less to play locations.",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "location",
      },
    },
  ],
  i18n: illuminaryTunnelsLinkedCavernsI18n,
};
