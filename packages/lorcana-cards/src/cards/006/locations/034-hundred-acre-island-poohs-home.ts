import type { LocationCard } from "@tcg/lorcana-types";

export const hundredAcreIslandPoohsHome: LocationCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "5uo-1",
      text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 34,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "151793bdd22cfedc309bf2800d3835a4e0ed038c",
  },
  franchise: "Winnie the Pooh",
  fullName: "Hundred Acre Island - Pooh's Home",
  id: "5uo",
  inkType: ["amber"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Hundred Acre Island",
  set: "006",
  text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
  version: "Pooh's Home",
};
