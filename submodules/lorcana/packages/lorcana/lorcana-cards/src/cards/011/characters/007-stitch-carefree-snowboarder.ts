import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCarefreeSnowboarderI18n } from "./007-stitch-carefree-snowboarder.i18n";

export const stitchCarefreeSnowboarder: CharacterCard = {
  id: "7zq",
  canonicalId: "ci_vWQ",
  reprints: ["set11-007"],
  cardType: "character",
  name: "Stitch",
  version: "Carefree Snowboarder",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 7,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_adca393d2367497aac99f2c4dd29b8ce",
  },
  text: [
    {
      title: "BRING YOUR FRIENDS",
      description:
        "Whenever this character quests, if you have 2 or more other characters in play, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      id: "1hd-1",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
        },
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
      name: "BRING YOUR FRIENDS",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "BRING YOUR FRIENDS Whenever this character quests, if you have 2 or more other characters in play, you may draw a card.",
    },
  ],
  i18n: stitchCarefreeSnowboarderI18n,
};
