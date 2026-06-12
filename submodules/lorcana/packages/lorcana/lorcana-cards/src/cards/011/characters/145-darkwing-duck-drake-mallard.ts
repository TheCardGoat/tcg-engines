import type { CharacterCard } from "@tcg/lorcana-types";
import { darkwingDuckDrakeMallardI18n } from "./145-darkwing-duck-drake-mallard.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const darkwingDuckDrakeMallard: CharacterCard = {
  id: "oJV",
  canonicalId: "ci_oJV",
  reprints: ["set11-145"],
  cardType: "character",
  name: "Darkwing Duck",
  version: "Drake Mallard",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 145,
  rarity: "uncommon",
  cost: 2,
  strength: 4,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_39abc3bfefc14489beca55a40a48153c",
    tcgPlayer: 673743,
  },
  text: "Ward",
  classifications: ["Storyborn", "Super", "Hero", "Detective"],
  abilities: [ward],
  i18n: darkwingDuckDrakeMallardI18n,
};
