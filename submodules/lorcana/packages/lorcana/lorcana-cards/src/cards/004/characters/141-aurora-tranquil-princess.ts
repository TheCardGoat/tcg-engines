import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraTranquilPrincessI18n } from "./141-aurora-tranquil-princess.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const auroraTranquilPrincess: CharacterCard = {
  id: "I2B",
  canonicalId: "ci_FEs",
  reprints: ["set4-141", "set9-154"],
  cardType: "character",
  name: "Aurora",
  version: "Tranquil Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 141,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_84ca414b157a462fa322e66c8fe9cebc",
    tcgPlayer: 650089,
  },
  text: "Ward",
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [ward],
  i18n: auroraTranquilPrincessI18n,
};
