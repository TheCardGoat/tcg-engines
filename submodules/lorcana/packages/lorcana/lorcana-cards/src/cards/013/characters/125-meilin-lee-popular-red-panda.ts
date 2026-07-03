import type { CharacterCard } from "@tcg/lorcana-types";
import { temporaryShift } from "../../../helpers/abilities/shift";
import { meilinLeePopularRedPandaI18n } from "./125-meilin-lee-popular-red-panda.i18n";

export const meilinLeePopularRedPandaAbilities: CharacterCard["abilities"] = [
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
];

export const meilinLeePopularRedPanda: CharacterCard = {
  id: "KWX",
  canonicalId: "ci_KWX",
  slug: "lorcana-ci_KWX",
  printings: [
    {
      id: "set13-125",
      artId: "set13-125",
      setCode: "set13",
      collectorNumber: "125",
      rarity: "legendary",
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
  cardNumber: 125,
  rarity: "legendary",
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
  i18n: meilinLeePopularRedPandaI18n,
};
