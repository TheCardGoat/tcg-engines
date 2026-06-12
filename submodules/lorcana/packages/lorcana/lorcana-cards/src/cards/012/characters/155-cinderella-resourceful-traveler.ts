import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaResourcefulTravelerI18n } from "./155-cinderella-resourceful-traveler.i18n";

export const cinderellaResourcefulTraveler: CharacterCard = {
  id: "AKb",
  canonicalId: "ci_AKb",
  reprints: ["set12-155"],
  cardType: "character",
  name: "Cinderella",
  version: "Resourceful Traveler",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "012",
  cardNumber: 155,
  rarity: "rare",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f4e355fa31614d7885933e92a5d0c821",
  },
  text: [
    {
      title: "THIS AND THAT",
      description:
        "Whenever this character quests, if you played another character this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "8Mn-1",
      name: "THIS AND THAT",
      type: "triggered",
      text: "THIS AND THAT Whenever this character quests, if you played another character this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        excludeSource: true,
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
        },
      },
    },
  ],
  i18n: cinderellaResourcefulTravelerI18n,
};
