import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseBraveLittleTailorD23I18n } from "./d23-001-mickey-mouse-brave-little-tailor.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const mickeyMouseBraveLittleTailorD23: CharacterCard = {
  id: "dXc",
  canonicalId: "ci_vrS",
  slug: "lorcana-ci_vrS",
  printings: [
    {
      id: "set1-d23-001",
      artId: "set1-d23-001",
      setCode: "set1",
      collectorNumber: "1",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set1-d23-001", "set1-115"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Tailor",
  inkType: ["ruby"],
  franchise: "D23",
  set: "001",
  cardNumber: 1,
  rarity: "special",
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_a0a1e1bb99794f04991929ced6001ae8",
    tcgPlayer: "559532",
  },
  text: "<Evasive>",
  classifications: ["Dreamborn", "Hero"],
  abilities: [evasive],
  i18n: mickeyMouseBraveLittleTailorD23I18n,
};
