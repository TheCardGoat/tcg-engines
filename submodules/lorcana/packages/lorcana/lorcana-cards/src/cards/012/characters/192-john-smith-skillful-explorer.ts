import type { CharacterCard } from "@tcg/lorcana-types";
import { johnSmithSkillfulExplorerI18n } from "./192-john-smith-skillful-explorer.i18n";

export const johnSmithSkillfulExplorer: CharacterCard = {
  id: "nnM",
  canonicalId: "ci_nnM",
  reprints: ["set12-192"],
  cardType: "character",
  name: "John Smith",
  version: "Skillful Explorer",
  inkType: ["steel"],
  franchise: "Pocahontas",
  set: "012",
  cardNumber: 192,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_78ac2c6c97844444a40bdfebc124745c",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: johnSmithSkillfulExplorerI18n,
};
