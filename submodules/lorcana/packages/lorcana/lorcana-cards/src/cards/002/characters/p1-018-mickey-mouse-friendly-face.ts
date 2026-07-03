import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseFriendlyFaceP1I18n } from "./p1-018-mickey-mouse-friendly-face.i18n";

export const mickeyMouseFriendlyFaceP1: CharacterCard = {
  id: "udf",
  canonicalId: "ci_igT",
  slug: "lorcana-ci_igT",
  printings: [
    {
      id: "set2-p1-018",
      artId: "set2-p1-018",
      setCode: "set2",
      collectorNumber: "18",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set2-013", "set2-p1-018"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Friendly Face",
  inkType: ["amber"],
  set: "002",
  cardNumber: 18,
  rarity: "special",
  cost: 6,
  strength: 1,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_e32380ac2e3f4e69b385cad4b3c3df11",
    tcgPlayer: "516384",
  },
  text: [
    {
      title: "Glad You're Here!",
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
  i18n: mickeyMouseFriendlyFaceP1I18n,
};
