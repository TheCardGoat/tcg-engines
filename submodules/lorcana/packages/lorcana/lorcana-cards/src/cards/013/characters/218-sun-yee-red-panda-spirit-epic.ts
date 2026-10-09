import type { CharacterCard } from "@tcg/lorcana-types";
import { sunYeeRedPandaSpiritEpicI18n } from "./218-sun-yee-red-panda-spirit-epic.i18n";

import { temporaryShift } from "../../../helpers/abilities/shift";

export const sunYeeRedPandaSpiritEpic: CharacterCard = {
  id: "Ruz",
  canonicalId: "ci_wnn",
  slug: "lorcana-ci_wnn",
  printings: [
    {
      id: "set13-218-epic",
      artId: "ci_wnn-epic",
      setCode: "set13",
      collectorNumber: "218",
      rarity: "epic",
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
  cardNumber: 218,
  rarity: "epic",
  specialRarity: "epic",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8876f6dd20db473bb3aa2e97df698a43",
    tcgPlayer: "704627",
  },
  text: [
    {
      title: "Temporary Red Panda Shift 2 {I}",
      description:
        "(You may pay 2 {I} to play this on top of one of your Red Panda characters. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
    },
  ],
  classifications: ["Storyborn", "Red Panda"],
  abilities: [temporaryShift("Red Panda", 2, "classification")],
  i18n: sunYeeRedPandaSpiritEpicI18n,
};
