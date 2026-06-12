import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseBraveLittleTailorI18n } from "./115-mickey-mouse-brave-little-tailor.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const mickeyMouseBraveLittleTailor: CharacterCard = {
  id: "vrS",
  canonicalId: "ci_vrS",
  reprints: ["set1-115"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  inkType: ["ruby"],
  set: "001",
  cardNumber: 115,
  rarity: "legendary",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0a1e1bb99794f04991929ced6001ae8",
    tcgPlayer: 559532,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Hero"],
  abilities: [evasive],
  i18n: mickeyMouseBraveLittleTailorI18n,
};
