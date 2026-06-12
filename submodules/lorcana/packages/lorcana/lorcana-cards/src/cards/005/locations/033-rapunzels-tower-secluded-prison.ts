import type { LocationCard } from "@tcg/lorcana-types";
import { rapunzelsTowerSecludedPrisonI18n } from "./033-rapunzels-tower-secluded-prison.i18n";

export const rapunzelsTowerSecludedPrison: LocationCard = {
  id: "RU5",
  canonicalId: "ci_RU5",
  reprints: ["set5-033"],
  cardType: "location",
  name: "Rapunzel's Tower",
  version: "Secluded Prison",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 33,
  rarity: "uncommon",
  cost: 2,
  willpower: 8,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_f27b7d5ae80b49c4a1a6019138a14ace",
    tcgPlayer: 560916,
  },
  text: [
    {
      title: "SAFE AND SOUND",
      description: "Characters get +3 {W} while here.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 3,
        stat: "willpower",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "vng-1",
      name: "SAFE AND SOUND",
      text: "SAFE AND SOUND Characters get +3 {W} while here.",
      type: "static",
    },
  ],
  i18n: rapunzelsTowerSecludedPrisonI18n,
};
