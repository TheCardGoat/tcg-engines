import type { CharacterCard } from "@tcg/lorcana-types";
import { pascalRapunzelsCompanionI18n } from "./053-pascal-rapunzels-companion.i18n";

export const pascalRapunzelsCompanion: CharacterCard = {
  id: "81V",
  canonicalId: "ci_81V",
  reprints: ["set1-053"],
  cardType: "character",
  name: "Pascal",
  version: "Rapunzel’s Companion",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 53,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_52d47bf453634824858ebdd26f42d5f6",
    tcgPlayer: 493488,
  },
  text: [
    {
      title: "CAMOUFLAGE",
      description: "While you have another character in play, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-another-character",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1f9-1",
      name: "CAMOUFLAGE",
      text: "CAMOUFLAGE While you have another character in play, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: pascalRapunzelsCompanionI18n,
};
