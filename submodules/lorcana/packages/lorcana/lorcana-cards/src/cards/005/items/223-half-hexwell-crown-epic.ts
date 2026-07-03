import type { ItemCard } from "@tcg/lorcana-types";
import { halfHexwellCrownEpicI18n } from "./223-half-hexwell-crown-epic.i18n";

export const halfHexwellCrownEpic: ItemCard = {
  id: "Vry",
  canonicalId: "ci_o4o",
  slug: "lorcana-ci_o4o",
  printings: [
    {
      id: "set5-223-epic",
      artId: "ci_o4o-epic",
      setCode: "set5",
      collectorNumber: "223",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set5-065"],
  cardType: "item",
  name: "Half Hexwell Crown",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 223,
  rarity: "rare",
  specialRarity: "epic",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_cbd6fc9596f14329af2f0c237a7be6a2",
    tcgPlayer: "557538",
  },
  text: [
    {
      title: "AN UNEXPECTED FIND",
      description: "{E}, 2 {I} — Draw a card.",
    },
    {
      title: "A PERILOUS POWER",
      description: "{E}, 2 {I}, Discard a card — Exert chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "vzu-1",
      name: "AN UNEXPECTED FIND",
      text: "AN UNEXPECTED FIND {E}, 2 {I} — Draw a card.",
      type: "activated",
    },
    {
      cost: {
        exert: true,
        ink: 2,
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "exert",
      },
      id: "vzu-2",
      name: "A PERILOUS POWER",
      text: "A PERILOUS POWER {E}, 2 {I}, Discard a card — Exert chosen character.",
      type: "activated",
    },
  ],
  i18n: halfHexwellCrownEpicI18n,
};
