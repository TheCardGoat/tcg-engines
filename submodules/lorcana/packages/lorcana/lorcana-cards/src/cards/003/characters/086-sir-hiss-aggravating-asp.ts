import type { CharacterCard } from "@tcg/lorcana-types";
import { sirHissAggravatingAspI18n } from "./086-sir-hiss-aggravating-asp.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const sirHissAggravatingAsp: CharacterCard = {
  id: "O7w",
  canonicalId: "ci_O7w",
  reprints: ["set3-086"],
  cardType: "character",
  name: "Sir Hiss",
  version: "Aggravating Asp",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 86,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8ab16485ed264e15b2e70a3ff7d97ce0",
    tcgPlayer: 537932,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Ally"],
  abilities: [evasive],
  i18n: sirHissAggravatingAspI18n,
};
