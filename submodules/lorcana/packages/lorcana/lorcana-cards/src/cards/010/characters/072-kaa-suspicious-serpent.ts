import type { CharacterCard } from "@tcg/lorcana-types";
import { kaaSuspiciousSerpentI18n } from "./072-kaa-suspicious-serpent.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const kaaSuspiciousSerpent: CharacterCard = {
  id: "88q",
  canonicalId: "ci_88q",
  slug: "lorcana-ci_88q",
  printings: [
    {
      id: "set10-072",
      artId: "set10-072",
      setCode: "set10",
      collectorNumber: "72",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set10-072"],
  cardType: "character",
  name: "Kaa",
  version: "Suspicious Serpent",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 72,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f4468086528c47d289a18c4681699d76",
    tcgPlayer: "660038",
  },
  text: "Ward",
  classifications: ["Storyborn", "Villain"],
  abilities: [ward],
  i18n: kaaSuspiciousSerpentI18n,
};
