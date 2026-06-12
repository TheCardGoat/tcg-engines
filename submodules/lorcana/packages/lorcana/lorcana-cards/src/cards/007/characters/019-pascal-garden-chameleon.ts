import type { CharacterCard } from "@tcg/lorcana-types";
import { pascalGardenChameleonI18n } from "./019-pascal-garden-chameleon.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const pascalGardenChameleon: CharacterCard = {
  id: "CD3",
  canonicalId: "ci_CD3",
  reprints: ["set7-019"],
  cardType: "character",
  name: "Pascal",
  version: "Garden Chameleon",
  inkType: ["amber", "amethyst"],
  franchise: "Tangled",
  set: "007",
  cardNumber: 19,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_b2dd259955af479c8816391e13d4e16d",
    tcgPlayer: 618129,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: pascalGardenChameleonI18n,
};
