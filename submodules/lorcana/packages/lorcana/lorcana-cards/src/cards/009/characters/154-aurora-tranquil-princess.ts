import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraTranquilPrincessI18n } from "./154-aurora-tranquil-princess.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const auroraTranquilPrincess: CharacterCard = {
  id: "z67",
  canonicalId: "ci_FEs",
  slug: "lorcana-ci_FEs",
  printings: [
    {
      id: "set9-154",
      artId: "set9-154",
      setCode: "set9",
      collectorNumber: "154",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-141", "set9-154"],
  cardType: "character",
  name: "Aurora",
  version: "Tranquil Princess",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  cardNumber: 154,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_84ca414b157a462fa322e66c8fe9cebc",
    tcgPlayer: "650089",
  },
  text: "Ward",
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [ward],
  i18n: auroraTranquilPrincessI18n,
};
