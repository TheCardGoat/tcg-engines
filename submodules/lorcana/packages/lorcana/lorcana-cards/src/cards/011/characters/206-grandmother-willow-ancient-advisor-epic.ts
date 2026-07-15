import type { CharacterCard } from "@tcg/lorcana-types";
import { grandmotherWillowAncientAdvisorEpicI18n } from "./206-grandmother-willow-ancient-advisor-epic.i18n";

export const grandmotherWillowAncientAdvisorEpic: CharacterCard = {
  id: "qyV",
  canonicalId: "ci_Qej",
  slug: "lorcana-ci_Qej",
  printings: [
    {
      id: "set11-206-epic",
      artId: "ci_Qej-epic",
      setCode: "set11",
      collectorNumber: "206",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-013"],
  cardType: "character",
  name: "Grandmother Willow",
  version: "Ancient Advisor",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 206,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d8dddac12b0749ba9c6510af447895bd",
    tcgPlayer: "677143",
  },
  text: [
    {
      title: "SMOOTH THE WAY",
      description:
        "Once during your turn, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      id: "r79-1",
      name: "SMOOTH THE WAY",
      type: "triggered",
      autoResolve: true,
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
        cardType: "character",
        duration: "next-play-this-turn",
      },
      text: "SMOOTH THE WAY Once during your turn, you pay 1 {I} less for the next character you play this turn.",
    },
    {
      id: "r79-2",
      name: "SMOOTH THE WAY",
      type: "triggered",
      autoResolve: true,
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        target: "CONTROLLER",
        cardType: "character",
        duration: "next-play-this-turn",
      },
      text: "SMOOTH THE WAY Once during your turn, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  i18n: grandmotherWillowAncientAdvisorEpicI18n,
};
