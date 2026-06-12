import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckRichestDuckInTheWorldI18n } from "./154-scrooge-mcduck-richest-duck-in-the-world.i18n";

export const scroogeMcduckRichestDuckInTheWorld: CharacterCard = {
  id: "wAM",
  canonicalId: "ci_SyL",
  reprints: ["set3-154"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Richest Duck in the World",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 154,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ee9f19ba64f54bf78ba3cf40e0cac256",
    tcgPlayer: 539168,
  },
  text: [
    {
      title: "I'M GOING HOME!",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
    {
      title: "I DIDN'T GET RICH BY BEING STUPID",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1f8-1",
      name: "I'M GOING HOME!",
      text: "I'M GOING HOME! During your turn, this character gains Evasive.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "1f8-2",
      name: "I DIDN'T GET RICH BY BEING STUPID",
      text: "I DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: scroogeMcduckRichestDuckInTheWorldI18n,
};
