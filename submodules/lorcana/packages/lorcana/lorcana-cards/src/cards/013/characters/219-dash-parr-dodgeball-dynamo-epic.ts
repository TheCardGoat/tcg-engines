import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrDodgeballDynamoEpicI18n } from "./219-dash-parr-dodgeball-dynamo-epic.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const dashParrDodgeballDynamoEpic: CharacterCard = {
  id: "M9r",
  canonicalId: "ci_ABg",
  slug: "lorcana-ci_ABg",
  printings: [
    {
      id: "set13-219-epic",
      artId: "ci_ABg-epic",
      setCode: "set13",
      collectorNumber: "219",
      rarity: "epic",
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
  cardNumber: 219,
  rarity: "epic",
  specialRarity: "epic",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8c249d35d6ec4904b10f4d9641cf5914",
    tcgPlayer: "704623",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [evasive],
  i18n: dashParrDodgeballDynamoEpicI18n,
};
