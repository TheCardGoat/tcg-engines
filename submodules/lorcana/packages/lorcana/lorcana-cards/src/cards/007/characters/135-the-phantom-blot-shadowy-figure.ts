import type { CharacterCard } from "@tcg/lorcana-types";
import { thePhantomBlotShadowyFigureI18n } from "./135-the-phantom-blot-shadowy-figure.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const thePhantomBlotShadowyFigure: CharacterCard = {
  id: "jqj",
  canonicalId: "ci_jqj",
  reprints: ["set7-135"],
  cardType: "character",
  name: "The Phantom Blot",
  version: "Shadowy Figure",
  inkType: ["ruby"],
  set: "007",
  cardNumber: 135,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_1d8717ca485141a48e480838e3667ca3",
    tcgPlayer: 619481,
  },
  text: "Rush",
  classifications: ["Storyborn", "Villain"],
  abilities: [rush],
  i18n: thePhantomBlotShadowyFigureI18n,
};
