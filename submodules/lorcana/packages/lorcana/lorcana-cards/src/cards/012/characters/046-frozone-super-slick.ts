import type { CharacterCard } from "@tcg/lorcana-types";
import { frozoneSuperSlickI18n } from "./046-frozone-super-slick.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const frozoneSuperSlick: CharacterCard = {
  id: "cV4",
  canonicalId: "ci_cV4",
  reprints: ["set12-046"],
  cardType: "character",
  name: "Frozone",
  version: "Super Slick",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 46,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_176292aded014342b14e66e92f47427b",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [evasive],
  i18n: frozoneSuperSlickI18n,
};
