import type { CharacterCard } from "@tcg/lorcana-types";
import { kristoffOfficialIceMasterI18n } from "./182-kristoff-official-ice-master.i18n";

export const kristoffOfficialIceMaster: CharacterCard = {
  id: "YXQ",
  canonicalId: "ci_YXQ",
  reprints: ["set1-182"],
  cardType: "character",
  name: "Kristoff",
  version: "Official Ice Master",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 182,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_097bd499debd459f9ce55afa7bc72d66",
    tcgPlayer: 492998,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: kristoffOfficialIceMasterI18n,
};
