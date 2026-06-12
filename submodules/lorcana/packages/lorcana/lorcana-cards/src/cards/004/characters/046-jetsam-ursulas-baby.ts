import type { CharacterCard } from "@tcg/lorcana-types";
import { jetsamUrsulasBabyI18n } from "./046-jetsam-ursulas-baby.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const jetsamUrsulasBaby: CharacterCard = {
  id: "jZW",
  canonicalId: "ci_jZW",
  reprints: ["set4-046"],
  cardType: "character",
  name: "Jetsam",
  version: 'Ursula\'s "Baby"',
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 46,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b61f1e595b3844cdad00a05ee402457b",
    tcgPlayer: 549468,
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "OMINOUS PAIR",
      description: "Your characters named Flotsam gain Challenger +2.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    challenger(2),
    {
      effect: {
        keyword: "Challenger",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-name", name: "Flotsam" }],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "du5-2",
      name: "OMINOUS PAIR",
      text: "OMINOUS PAIR Your characters named Flotsam gain Challenger +2.",
      type: "static",
    },
  ],
  i18n: jetsamUrsulasBabyI18n,
};
