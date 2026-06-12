import type { CharacterCard } from "@tcg/lorcana-types";
import { fatCatFeloniousFelineI18n } from "./182-fat-cat-felonious-feline.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const fatCatFeloniousFeline: CharacterCard = {
  id: "Riy",
  canonicalId: "ci_Riy",
  reprints: ["set12-182"],
  cardType: "character",
  name: "Fat Cat",
  version: "Felonious Feline",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 182,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9ce6a1417e4049989dae66845d3aeb70",
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Villain"],
  abilities: [resist(1)],
  i18n: fatCatFeloniousFelineI18n,
};
