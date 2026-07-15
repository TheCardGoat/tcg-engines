import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaUndeterredVoyagerI18n } from "./116-moana-undeterred-voyager.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const moanaUndeterredVoyager: CharacterCard = {
  id: "t7x",
  canonicalId: "ci_HAc",
  slug: "lorcana-ci_HAc",
  printings: [
    {
      id: "set9-116",
      artId: "set9-116",
      setCode: "set9",
      collectorNumber: "116",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-117", "set9-116"],
  cardType: "character",
  name: "Moana",
  version: "Undeterred Voyager",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "009",
  cardNumber: 116,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0f11f39f42d84f9cb09ca24a2893f39d",
    tcgPlayer: "650052",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [evasive],
  i18n: moanaUndeterredVoyagerI18n,
};
