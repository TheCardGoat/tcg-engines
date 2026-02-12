import type { LocationCard } from "@tcg/lorcana-types";

export const illuminaryTunnelsLinkedCaverns: LocationCard = {
  abilities: [
    {
      condition: {
        type: "has-character-here",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "locations-in-play",
          controller: "you",
        },
        target: "SELF",
      },
      id: "1ij-1",
      name: "SUBTERRANEAN NETWORK",
      text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.",
      type: "static",
    },
    {
      condition: {
        type: "has-character-here",
      },
      effect: {
        type: "cost-reduction",
        amount: 0,
        cardType: "location",
      },
      id: "1ij-2",
      name: "LOCUS",
      text: "LOCUS While you have a character here, you pay 1 {I} less to play locations.",
      type: "static",
    },
  ],
  cardNumber: 202,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "c5a75c70a7b0fda205c02f87ffa3da1a39760352",
  },
  franchise: "Lorcana",
  fullName: "Illuminary Tunnels - Linked Caverns",
  id: "1ij",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  moveCost: 1,
  name: "Illuminary Tunnels",
  set: "010",
  text: "SUBTERRANEAN NETWORK While you have a character here, this location gets +1 {L} for each other location you have in play.\nLOCUS While you have a character here, you pay 1 {I} less to play locations.",
  version: "Linked Caverns",
};
