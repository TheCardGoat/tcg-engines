import type { CharacterCard } from "@tcg/lorcana-types";
import { basilPracticedDetectiveI18n } from "./153-basil-practiced-detective.i18n";

import { support } from "../../../helpers/abilities/support";

export const basilPracticedDetective: CharacterCard = {
  id: "F8I",
  canonicalId: "ci_F8I",
  slug: "lorcana-ci_F8I",
  printings: [
    {
      id: "set5-153",
      artId: "set5-153",
      setCode: "set5",
      collectorNumber: "153",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set5-153"],
  cardType: "character",
  name: "Basil",
  version: "Practiced Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 153,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b73a800e9b434141b154bd521d55d14c",
    tcgPlayer: "559713",
  },
  text: "Support",
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [support],
  i18n: basilPracticedDetectiveI18n,
};
