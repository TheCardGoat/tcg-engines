import type { CharacterCard } from "@tcg/lorcana-types";
import { princeCharmingHeirToTheThroneI18n } from "./157-prince-charming-heir-to-the-throne.i18n";

export const princeCharmingHeirToTheThrone: CharacterCard = {
  id: "MlM",
  canonicalId: "ci_MlM",
  reprints: ["set2-157"],
  cardType: "character",
  name: "Prince Charming",
  version: "Heir to the Throne",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 157,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_06f238177bee499eab1cf34e60e55725",
    tcgPlayer: 522718,
  },
  classifications: ["Dreamborn", "Hero", "Prince"],
  i18n: princeCharmingHeirToTheThroneI18n,
};
