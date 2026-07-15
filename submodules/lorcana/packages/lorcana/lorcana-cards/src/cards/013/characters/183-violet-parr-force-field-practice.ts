import type { CharacterCard } from "@tcg/lorcana-types";
import { violetParrForceFieldPracticeI18n } from "./183-violet-parr-force-field-practice.i18n";

import { resist } from "../../../helpers/abilities/resist";

export const violetParrForceFieldPractice: CharacterCard = {
  id: "F0D",
  canonicalId: "ci_F0D",
  slug: "lorcana-ci_F0D",
  printings: [
    {
      id: "set13-183",
      artId: "set13-183",
      setCode: "set13",
      collectorNumber: "183",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-183"],
  cardType: "character",
  name: "Violet Parr",
  version: "Force Field Practice",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 183,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_92536b3f5ff44ef4b1a018151d15d441",
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [resist(1)],
  i18n: violetParrForceFieldPracticeI18n,
};
