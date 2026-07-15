import type { CharacterCard } from "@tcg/lorcana-types";
import { abbyParkOverTheTopI18n } from "./014-abby-park-over-the-top.i18n";

export const abbyParkOverTheTop: CharacterCard = {
  id: "UTH",
  canonicalId: "ci_UTH",
  slug: "lorcana-ci_UTH",
  printings: [
    {
      id: "set13-014",
      artId: "set13-014",
      setCode: "set13",
      collectorNumber: "14",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-014"],
  cardType: "character",
  name: "Abby Park",
  version: "Over the Top",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 14,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_693ca1dddf28469fb0ca4cb673c42157",
  },
  text: [
    {
      title: "ROCK THE MIC",
      description:
        "Once during your turn, whenever you play a song, you may ready this character. If you do, she can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "ROCK THE MIC",
      text: "ROCK THE MIC Once during your turn, whenever you play a song, you may ready this character. If you do, she can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
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
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "ready",
              target: "SELF",
            },
            {
              type: "restriction",
              restriction: "cant-quest-or-challenge",
              target: "SELF",
              duration: "this-turn",
            },
          ],
        },
      },
    },
  ],
  i18n: abbyParkOverTheTopI18n,
};
