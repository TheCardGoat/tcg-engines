import type { LocationCard } from "@tcg/lorcana-types";
import { theSorcerersTowerWondrousWorkspaceI18n } from "./068-the-sorcerers-tower-wondrous-workspace.i18n";

export const theSorcerersTowerWondrousWorkspace: LocationCard = {
  id: "GJL",
  canonicalId: "ci_GJL",
  reprints: ["set3-068"],
  cardType: "location",
  name: "The Sorcerer's Tower",
  version: "Wondrous Workspace",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 68,
  rarity: "uncommon",
  cost: 3,
  willpower: 7,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_d9a1c24b8bf4469f8535e75c38cf61f7",
    tcgPlayer: 535148,
  },
  text: [
    {
      title: "BROOM CLOSET",
      description: "Your characters named Magic Broom may move here for free.",
    },
    {
      title: "MAGICAL POWER",
      description: "Characters get +1 {L} while here.",
    },
  ],
  abilities: [
    {
      id: "GJL-1",
      name: "BROOM CLOSET",
      effect: {
        filter: {
          name: "Magic Broom",
        },
        location: "here",
        reduction: "free",
        type: "move-cost-reduction",
      },
      text: "BROOM CLOSET Your characters named Magic Broom may move here for free.",
      type: "static",
    },
    {
      id: "GJL-2",
      name: "MAGICAL POWER",
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      text: "MAGICAL POWER Characters get +1 {L} while here.",
      type: "static",
    },
  ],
  i18n: theSorcerersTowerWondrousWorkspaceI18n,
};
