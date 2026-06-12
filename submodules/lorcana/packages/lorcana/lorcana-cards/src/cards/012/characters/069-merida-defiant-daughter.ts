import type { CharacterCard } from "@tcg/lorcana-types";
import { meridaDefiantDaughterI18n } from "./069-merida-defiant-daughter.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const meridaDefiantDaughter: CharacterCard = {
  id: "2e1",
  canonicalId: "ci_2e1",
  reprints: ["set12-069"],
  cardType: "character",
  name: "Merida",
  version: "Defiant Daughter",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 69,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_63708f32e69544309aa60156ce8603fa",
  },
  text: "Ward",
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [ward],
  i18n: meridaDefiantDaughterI18n,
};
