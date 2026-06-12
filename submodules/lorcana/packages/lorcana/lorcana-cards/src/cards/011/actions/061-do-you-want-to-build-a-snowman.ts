import type { ActionCard } from "@tcg/lorcana-types";
import { doYouWantToBuildASnowmanI18n } from "./061-do-you-want-to-build-a-snowman.i18n";

export const doYouWantToBuildASnowman: ActionCard = {
  id: "tmK",
  canonicalId: "ci_tmK",
  reprints: ["set11-061"],
  cardType: "action",
  name: "Do You Want to Build A Snowman?",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 61,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_adb608b3667f4c769a3bab709840dad1",
    tcgPlayer: 668577,
  },
  text: [
    {
      title: "Chosen opponent chooses YES! or NO!:",
    },
    {
      title: "* YES!",
      description: "You gain 3 lore.",
    },
    {
      title:
        "* NO! They choose a character of theirs and put that card on the bottom of their deck.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen opponent chooses YES! or NO!: YES! You gain 3 lore. NO! They choose a character of theirs and put that card on the bottom of their deck.",
      effect: {
        type: "choice",
        chooser: "OPPONENT",
        optionLabels: [
          "YES! They gain 3 lore.",
          "NO! Choose one of your characters and put it on the bottom of your deck.",
        ],
        options: [
          {
            type: "gain-lore",
            amount: 3,
            target: "CONTROLLER",
          },
          {
            type: "put-on-bottom",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
    },
  ],
  i18n: doYouWantToBuildASnowmanI18n,
};
