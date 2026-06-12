import type { CharacterCard } from "@tcg/lorcana-types";
import { tiggerWonderfulThingI18n } from "./127-tigger-wonderful-thing.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const tiggerWonderfulThing: CharacterCard = {
  id: "H06",
  canonicalId: "ci_H06",
  reprints: ["set1-127"],
  cardType: "character",
  name: "Tigger",
  version: "Wonderful Thing",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "001",
  cardNumber: 127,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f1f7e5ef15f04872a721d1792aa677d1",
    tcgPlayer: 489638,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Tigger"],
  abilities: [evasive],
  i18n: tiggerWonderfulThingI18n,
};
