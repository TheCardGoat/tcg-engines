import type { CharacterCard } from "@tcg/lorcana-types";
import { theNokkWaterSpiritI18n } from "./160-the-nokk-water-spirit.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const theNokkWaterSpirit: CharacterCard = {
  id: "2Pk",
  canonicalId: "ci_2Pk",
  reprints: ["set2-160"],
  cardType: "character",
  name: "The Nokk",
  version: "Water Spirit",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "002",
  cardNumber: 160,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_780972e5c4f84315bcd27496ef5184a3",
    tcgPlayer: 527768,
  },
  text: "Ward",
  classifications: ["Storyborn"],
  abilities: [ward],
  i18n: theNokkWaterSpiritI18n,
};
