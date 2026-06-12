import type { CharacterCard } from "@tcg/lorcana-types";
import { abuMischievousMonkeyI18n } from "./103-abu-mischievous-monkey.i18n";

export const abuMischievousMonkey: CharacterCard = {
  id: "Dba",
  canonicalId: "ci_Dba",
  reprints: ["set1-103"],
  cardType: "character",
  name: "Abu",
  version: "Mischievous Monkey",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 103,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e080b948d1bd4c87b40c050f56b2d50f",
    tcgPlayer: 507461,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: abuMischievousMonkeyI18n,
};
