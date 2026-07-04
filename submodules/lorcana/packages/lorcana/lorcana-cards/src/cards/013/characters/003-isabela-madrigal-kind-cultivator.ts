import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalKindCultivatorI18n } from "./003-isabela-madrigal-kind-cultivator.i18n";

export const isabelaMadrigalKindCultivator: CharacterCard = {
  id: "KFE",
  canonicalId: "ci_KFE",
  slug: "lorcana-ci_KFE",
  printings: [
    {
      id: "set13-003",
      artId: "set13-003",
      setCode: "set13",
      collectorNumber: "3",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-003"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "Kind Cultivator",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "013",
  cardNumber: 3,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0720242347b14666bc3a97f5a1c64b00",
  },
  classifications: ["Storyborn", "Ally", "Madrigal"],
  i18n: isabelaMadrigalKindCultivatorI18n,
};
