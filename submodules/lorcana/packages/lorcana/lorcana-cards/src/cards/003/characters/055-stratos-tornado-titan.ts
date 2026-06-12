import type { CharacterCard } from "@tcg/lorcana-types";
import { stratosTornadoTitanI18n } from "./055-stratos-tornado-titan.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const stratosTornadoTitan: CharacterCard = {
  id: "NxG",
  canonicalId: "ci_NxG",
  reprints: ["set3-055"],
  cardType: "character",
  name: "Stratos",
  version: "Tornado Titan",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 55,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3263d84bb5645f3974b837b717d50f5",
    tcgPlayer: 539075,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "CYCLONE",
      description: "{E} — Gain lore equal to the number of Titan characters you have in play.",
    },
  ],
  classifications: ["Storyborn", "Titan"],
  abilities: [
    evasive,
    {
      id: "NxG-2",
      name: "CYCLONE",
      text: "CYCLONE {E} — Gain lore equal to the number of Titan characters you have in play.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-lore",
        amount: {
          type: "classification-character-count",
          classification: "Titan",
          controller: "you",
        },
      },
    },
  ],
  i18n: stratosTornadoTitanI18n,
};
