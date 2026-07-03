import type { CharacterCard } from "@tcg/lorcana-types";
import { merryweatherFeistyFairyI18n } from "./139-merryweather-feisty-fairy.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const merryweatherFeistyFairy: CharacterCard = {
  id: "Eab",
  canonicalId: "ci_Eab",
  slug: "lorcana-ci_Eab",
  printings: [
    {
      id: "set12-139",
      artId: "set12-139",
      setCode: "set12",
      collectorNumber: "139",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-139"],
  cardType: "character",
  name: "Merryweather",
  version: "Feisty Fairy",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "012",
  cardNumber: 139,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_31821d032ad0412f9bcc5868d002aa2a",
    tcgPlayer: "692179",
  },
  text: "Ward",
  classifications: ["Storyborn", "Ally", "Fairy"],
  abilities: [ward],
  i18n: merryweatherFeistyFairyI18n,
};
