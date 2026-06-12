import type { CharacterCard } from "@tcg/lorcana-types";
import { grandmotherWillowAncientAdvisorI18n } from "./013-grandmother-willow-ancient-advisor.i18n";

export const grandmotherWillowAncientAdvisor: CharacterCard = {
  id: "bN7",
  canonicalId: "ci_Qej",
  reprints: ["set11-013"],
  cardType: "character",
  name: "Grandmother Willow",
  version: "Ancient Advisor",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 13,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d8dddac12b0749ba9c6510af447895bd",
    tcgPlayer: 677143,
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
  i18n: grandmotherWillowAncientAdvisorI18n,
};
