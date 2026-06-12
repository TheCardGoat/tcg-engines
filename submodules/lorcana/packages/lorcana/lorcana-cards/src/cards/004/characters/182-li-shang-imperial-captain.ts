import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangImperialCaptainI18n } from "./182-li-shang-imperial-captain.i18n";

export const liShangImperialCaptain: CharacterCard = {
  id: "5lW",
  canonicalId: "ci_8Te",
  reprints: ["set4-182", "set9-193"],
  cardType: "character",
  name: "Li Shang",
  version: "Imperial Captain",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 182,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3a743f412ff34cd38bd9896f146950f4",
    tcgPlayer: 650126,
  },
  classifications: ["Dreamborn", "Hero", "Captain"],
  i18n: liShangImperialCaptainI18n,
};
