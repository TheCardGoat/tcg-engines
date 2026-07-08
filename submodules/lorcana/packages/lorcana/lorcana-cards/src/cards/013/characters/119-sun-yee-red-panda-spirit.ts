import type { CharacterCard } from "@tcg/lorcana-types";
import { sunYeeRedPandaSpiritI18n } from "./119-sun-yee-red-panda-spirit.i18n";

import { temporaryShift } from "../../../helpers/abilities/shift";

export const sunYeeRedPandaSpirit: CharacterCard = {
  id: "wnn",
  canonicalId: "ci_wnn",
  slug: "lorcana-ci_wnn",
  printings: [
    {
      id: "set13-119",
      artId: "set13-119",
      setCode: "set13",
      collectorNumber: "119",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-119"],
  cardType: "character",
  name: "Sun Yee",
  version: "Red Panda Spirit",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 119,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Temporary Red Panda Shift 2 {I}",
      description:
        "(You may pay 2 {I} to play this on top of one of your Red Panda characters. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
    },
  ],
  classifications: ["Storyborn", "Red Panda"],
  abilities: [temporaryShift("Red Panda", 2, "classification")],
  i18n: sunYeeRedPandaSpiritI18n,
};
