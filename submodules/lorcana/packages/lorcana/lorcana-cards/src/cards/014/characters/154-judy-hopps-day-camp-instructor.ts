import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities";
import { judyHoppsDayCampInstructorI18n } from "./154-judy-hopps-day-camp-instructor.i18n";

export const judyHoppsDayCampInstructor: CharacterCard = {
  id: "dyQ",
  canonicalId: "ci_dyQ",
  slug: "lorcana-ci_dyQ",
  printings: [
    {
      id: "set14-154",
      artId: "set14-154",
      setCode: "set14",
      collectorNumber: "154",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-154"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Day Camp Instructor",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 154,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c88e409716e8466b8850451676e23c0c",
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "LEND A PAW",
      description:
        "When you play this character, if you played another character this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    support,
    {
      id: "judy-daycamp-1",
      name: "LEND A PAW",
      type: "triggered",
      text: "LEND A PAW When you play this character, if you played another character this turn, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
        excludeSource: true,
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
    },
  ],
  i18n: judyHoppsDayCampInstructorI18n,
};
