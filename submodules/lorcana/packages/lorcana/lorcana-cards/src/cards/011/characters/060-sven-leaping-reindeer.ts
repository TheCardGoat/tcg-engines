import type { CharacterCard } from "@tcg/lorcana-types";
import { svenLeapingReindeerI18n } from "./060-sven-leaping-reindeer.i18n";
import { rush } from "../../../helpers/abilities/rush";
import { challenger } from "../../../helpers/abilities/challenger";
import { evasive } from "../../../helpers/abilities/evasive";

export const svenLeapingReindeer: CharacterCard = {
  id: "JOj",
  canonicalId: "ci_JOj",
  reprints: ["set11-060"],
  cardType: "character",
  name: "Sven",
  version: "Leaping Reindeer",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 60,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ad33da4d6a2e44569e0bb8f16810ba1a",
    tcgPlayer: 676195,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Challenger +3",
    },
    {
      title: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [rush, challenger(3), evasive],
  i18n: svenLeapingReindeerI18n,
};
