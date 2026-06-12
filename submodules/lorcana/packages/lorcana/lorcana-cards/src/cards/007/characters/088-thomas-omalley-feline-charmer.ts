import type { CharacterCard } from "@tcg/lorcana-types";
import { thomasOmalleyFelineCharmerI18n } from "./088-thomas-omalley-feline-charmer.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const thomasOmalleyFelineCharmer: CharacterCard = {
  id: "Gg5",
  canonicalId: "ci_Gg5",
  reprints: ["set7-088"],
  cardType: "character",
  name: "Thomas O'Malley",
  version: "Feline Charmer",
  inkType: ["emerald"],
  franchise: "Aristocats",
  set: "007",
  cardNumber: 88,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_48128e1a036e499a9822cb5bf2be18de",
    tcgPlayer: 618147,
  },
  text: "Ward",
  classifications: ["Storyborn", "Hero"],
  abilities: [ward],
  i18n: thomasOmalleyFelineCharmerI18n,
};
