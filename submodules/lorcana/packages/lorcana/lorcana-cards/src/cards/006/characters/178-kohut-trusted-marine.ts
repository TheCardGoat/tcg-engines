import type { CharacterCard } from "@tcg/lorcana-types";
import { kohutTrustedMarineI18n } from "./178-kohut-trusted-marine.i18n";

export const kohutTrustedMarine: CharacterCard = {
  id: "jgT",
  canonicalId: "ci_jgT",
  reprints: ["set6-178"],
  cardType: "character",
  name: "Kohut",
  version: "Trusted Marine",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 178,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3071dce7efaf4e139b192b2e026b2999",
    tcgPlayer: 592024,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: kohutTrustedMarineI18n,
};
