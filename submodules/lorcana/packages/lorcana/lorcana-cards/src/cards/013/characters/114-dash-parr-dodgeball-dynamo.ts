import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrDodgeballDynamoI18n } from "./114-dash-parr-dodgeball-dynamo.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const dashParrDodgeballDynamo: CharacterCard = {
  id: "ABg",
  canonicalId: "ci_ABg",
  slug: "lorcana-ci_ABg",
  printings: [
    {
      id: "set13-114",
      artId: "set13-114",
      setCode: "set13",
      collectorNumber: "114",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-114"],
  cardType: "character",
  name: "Dash Parr",
  version: "Dodgeball Dynamo",
  inkType: ["ruby"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 114,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  text: "Evasive",
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [evasive],
  i18n: dashParrDodgeballDynamoI18n,
};
