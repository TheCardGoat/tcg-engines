import type { CharacterCard } from "@tcg/lorcana-types";
import { liloPatientWeaverI18n } from "./010-lilo-patient-weaver.i18n";

import { support } from "../../../helpers/abilities/support";

export const liloPatientWeaver: CharacterCard = {
  id: "ZT4",
  canonicalId: "ci_ZT4",
  slug: "lorcana-ci_ZT4",
  printings: [
    {
      id: "set13-010",
      artId: "set13-010",
      setCode: "set13",
      collectorNumber: "10",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-010"],
  cardType: "character",
  name: "Lilo",
  version: "Patient Weaver",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 10,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: "Support",
  classifications: ["Storyborn", "Hero"],
  abilities: [support],
  i18n: liloPatientWeaverI18n,
};
