import type { CharacterCard } from "@tcg/lorcana-types";
import { fixitFelixJrTrustyBuilderI18n } from "./010-fix-it-felix-jr-trusty-builder.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const fixitFelixJrTrustyBuilder: CharacterCard = {
  id: "pKi",
  canonicalId: "ci_pKi",
  reprints: ["set5-010"],
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Trusty Builder",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 10,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e300981771704026815250b876ae28be",
    tcgPlayer: 559769,
  },
  text: "Bodyguard",
  classifications: ["Storyborn", "Hero"],
  abilities: [bodyguard],
  i18n: fixitFelixJrTrustyBuilderI18n,
};
