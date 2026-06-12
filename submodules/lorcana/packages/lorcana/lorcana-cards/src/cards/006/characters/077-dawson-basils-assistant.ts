import type { CharacterCard } from "@tcg/lorcana-types";
import { dawsonBasilsAssistantI18n } from "./077-dawson-basils-assistant.i18n";

export const dawsonBasilsAssistant: CharacterCard = {
  id: "hiv",
  canonicalId: "ci_hiv",
  reprints: ["set6-077"],
  cardType: "character",
  name: "Dawson",
  version: "Basil's Assistant",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  cardNumber: 77,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8c75431635854114b956328d8d30aa10",
    tcgPlayer: 591115,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: dawsonBasilsAssistantI18n,
};
