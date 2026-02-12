import type { LocationCard } from "@tcg/lorcana-types";

export const theSorcerersTowerWondrousWorkspace: LocationCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1ne-2",
      name: "MAGICAL POWER",
      text: "MAGICAL POWER Characters get +1 {L} while here.",
      type: "static",
    },
  ],
  cardNumber: 68,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "d54dd1bcc51723c954c04a6587a405b569bcc0c9",
  },
  franchise: "Fantasia",
  fullName: "The Sorcerer's Tower - Wondrous Workspace",
  id: "1ne",
  inkType: ["amethyst"],
  inkable: true,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  moveCost: 2,
  name: "The Sorcerer's Tower",
  set: "003",
  text: "BROOM CLOSET Your characters named Magic Broom may move here for free.\nMAGICAL POWER Characters get +1 {L} while here.",
  version: "Wondrous Workspace",
};
