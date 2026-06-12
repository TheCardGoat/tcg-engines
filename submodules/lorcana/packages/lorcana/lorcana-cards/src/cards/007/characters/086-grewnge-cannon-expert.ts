import type { CharacterCard } from "@tcg/lorcana-types";
import { grewngeCannonExpertI18n } from "./086-grewnge-cannon-expert.i18n";

export const grewngeCannonExpert: CharacterCard = {
  id: "QhC",
  canonicalId: "ci_QhC",
  reprints: ["set7-086"],
  cardType: "character",
  name: "Grewnge",
  version: "Cannon Expert",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "007",
  cardNumber: 86,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_95d2688246294e40900308cbc135856b",
    tcgPlayer: 618259,
  },
  text: [
    {
      title: "RAPID FIRE",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "action",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "15e-1",
      name: "RAPID FIRE",
      text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: grewngeCannonExpertI18n,
};
