import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseFriendlyFaceI18n } from "./013-mickey-mouse-friendly-face.i18n";

export const mickeyMouseFriendlyFace: CharacterCard = {
  id: "igT",
  canonicalId: "ci_igT",
  reprints: ["set2-013"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Friendly Face",
  inkType: ["amber"],
  set: "002",
  cardNumber: 13,
  rarity: "common",
  cost: 6,
  strength: 1,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_e32380ac2e3f4e69b385cad4b3c3df11",
    tcgPlayer: 516384,
  },
  text: [
    {
      title: "GLAD YOU'RE HERE!",
      description:
        "Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        amount: 3,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "1xe-1",
      name: "GLAD YOU'RE HERE!",
      text: "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseFriendlyFaceI18n,
};
