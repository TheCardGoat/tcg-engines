import type { LocationCard } from "@tcg/lorcana-types";

export const illuminaryTunnelsLinkedCaverns: LocationCard = {
  id: "1ij",
  cardType: "location",
  name: "Illuminary Tunnels",
  version: "Linked Caverns",
  fullName: "Illuminary Tunnels - Linked Caverns",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "010",
  text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.\nLOCUS While you have a character here, you pay 1 {I} less to play locations.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 202,
  inkable: true,
  externalIds: {
    ravensburger: "c5a75c70a7b0fda205c02f87ffa3da1a39760352",
  },
  abilities: [
    {
      id: "1ij-1",
      text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.",
      name: "SUBTERRANEAN NETWORK",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "locations-in-play",
          controller: "you",
        },
        target: "SELF",
      },
      condition: {
        type: "has-character-here",
      },
    },
    {
      id: "1ij-2",
      text: "LOCUS While you have a character here, you pay 1 {I} less to play locations.",
      name: "LOCUS",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: 0,
        cardType: "location",
      },
      condition: {
        type: "has-character-here",
      },
    },
  ],
};
