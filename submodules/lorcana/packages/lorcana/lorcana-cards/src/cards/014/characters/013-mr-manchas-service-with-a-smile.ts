import type { CharacterCard } from "@tcg/lorcana-types";
import { mrManchasServiceWithASmileI18n } from "./013-mr-manchas-service-with-a-smile.i18n";

export const mrManchasServiceWithASmile: CharacterCard = {
  id: "gFC",
  canonicalId: "ci_gFC",
  slug: "lorcana-ci_gFC",
  printings: [
    {
      id: "set14-013",
      artId: "set14-013",
      setCode: "set14",
      collectorNumber: "13",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-013"],
  cardType: "character",
  name: "Mr. Manchas",
  version: "Service with a Smile",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 13,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Always on Time",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "manchas-1",
      name: "Always on Time",
      type: "triggered",
      text: "Always on Time Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
      },
    },
  ],
  i18n: mrManchasServiceWithASmileI18n,
};
