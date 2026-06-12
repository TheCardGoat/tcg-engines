import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities/support";
import { annaMakingSnowPlansI18n } from "./139-anna-making-snow-plans.i18n";

export const annaMakingSnowPlans: CharacterCard = {
  id: "BGp",
  canonicalId: "ci_BGp",
  reprints: ["set10-139"],
  cardType: "character",
  name: "Anna",
  version: "Making Snow Plans",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  cardNumber: 139,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_13a02a2c79fa4493bc8a593d5fb1bd98",
    tcgPlayer: 659424,
  },
  text: "Support",
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [support],
  i18n: annaMakingSnowPlansI18n,
};
