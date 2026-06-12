import type { LocationCard } from "@tcg/lorcana-types";
import { hiddenCoveTranquilHavenI18n } from "./101-hidden-cove-tranquil-haven.i18n";

export const hiddenCoveTranquilHaven: LocationCard = {
  id: "4BC",
  canonicalId: "ci_Of3",
  reprints: ["set4-101", "set9-102"],
  cardType: "location",
  name: "Hidden Cove",
  version: "Tranquil Haven",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "004",
  cardNumber: 101,
  rarity: "common",
  cost: 1,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_a7b30a7923bd4b3596c48ede7e6b438e",
    tcgPlayer: 650040,
  },
  text: [
    {
      title: "REVITALIZING WATERS",
      description: "Characters get +1 {S} and +1 {W} while here.",
    },
  ],
  abilities: [
    {
      id: "1ts-1",
      name: "REVITALIZING WATERS",
      text: "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.",
      type: "static",
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
    },
    {
      id: "1ts-2",
      name: "REVITALIZING WATERS",
      text: "REVITALIZING WATERS Characters get +1 {S} and +1 {W} while here.",
      type: "static",
      effect: {
        modifier: 1,
        stat: "willpower",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
    },
  ],
  i18n: hiddenCoveTranquilHavenI18n,
};
