import type { CharacterCard } from "@tcg/lorcana-types";
import { philoctetesTrainerOfHeroesI18n } from "./156-philoctetes-trainer-of-heroes.i18n";
import { support } from "../../../helpers/abilities/support";

export const philoctetesTrainerOfHeroes: CharacterCard = {
  id: "BXf",
  canonicalId: "ci_BXf",
  reprints: ["set1-156"],
  cardType: "character",
  name: "Philoctetes",
  version: "Trainer of Heroes",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 156,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3d8ce215614244a483a06d6ecf99c2e2",
    tcgPlayer: 508875,
  },
  text: "Support",
  classifications: ["Storyborn", "Mentor"],
  abilities: [support],
  i18n: philoctetesTrainerOfHeroesI18n,
};
