import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangGeneralsSonI18n } from "./111-li-shang-generals-son.i18n";

export const liShangGeneralsSon: CharacterCard = {
  id: "Wbs",
  canonicalId: "ci_Wbs",
  reprints: ["set4-111"],
  cardType: "character",
  name: "Li Shang",
  version: "General’s Son",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 111,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bbec90ced5704bd6b427c55fcfc0e3bf",
    tcgPlayer: 550593,
  },
  classifications: ["Storyborn", "Hero"],
  i18n: liShangGeneralsSonI18n,
};
