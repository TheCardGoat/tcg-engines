import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeePopularRedPandaEnchantedI18n } from "./240-meilin-lee-popular-red-panda-enchanted.i18n";

import { temporaryShift } from "../../../helpers/abilities/shift";

export const meilinLeePopularRedPandaEnchanted: CharacterCard = {
  id: "zCZ",
  canonicalId: "ci_KWX",
  slug: "lorcana-ci_KWX",
  printings: [
    {
      id: "set13-240-enchanted",
      artId: "ci_KWX-enchanted",
      setCode: "set13",
      collectorNumber: "240",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set13-125"],
  cardType: "character",
  name: "Meilin Lee",
  version: "Popular Red Panda",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf8641478666476d982b2ce013982386",
  },
  text: [
    {
      title: "Temporary Shift 3 {I}",
      description:
        "(You may pay 3 {I} to play this on top of one of your characters named Meilin Lee. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
    },
    {
      title: "KARAOKE QUEEN",
      description: "Once during your turn, whenever this character sings a song, gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Red Panda"],
  abilities: [
    temporaryShift("Meilin Lee", 3),
    {
      type: "triggered",
      name: "KARAOKE QUEEN",
      text: "KARAOKE QUEEN Once during your turn, whenever this character sings a song, gain 3 lore.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "gain-lore",
        amount: 3,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: meilinLeePopularRedPandaEnchantedI18n,
};
