import type { CharacterCard } from "@tcg/lorcana-types";
import { genieInvestigativeMindI18n } from "./146-genie-investigative-mind.i18n";

export const genieInvestigativeMind: CharacterCard = {
  id: "wxG",
  canonicalId: "ci_wxG",
  reprints: ["set10-146"],
  cardType: "character",
  name: "Genie",
  version: "Investigative Mind",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  cardNumber: 146,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_cd2b67f12f9f42beab11392540a24c2e",
    tcgPlayer: 659382,
  },
  classifications: ["Storyborn", "Ally", "Detective"],
  i18n: genieInvestigativeMindI18n,
};
