import type { CharacterCard } from "@tcg/lorcana-types";
import { ichabodCraneBookishSchoolmasterI18n } from "./148-ichabod-crane-bookish-schoolmaster.i18n";

export const ichabodCraneBookishSchoolmaster: CharacterCard = {
  id: "Nus",
  canonicalId: "ci_Nus",
  reprints: ["set10-148"],
  cardType: "character",
  name: "Ichabod Crane",
  version: "Bookish Schoolmaster",
  inkType: ["sapphire"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 148,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_83cc465308474e60aed6b86986d57854",
    tcgPlayer: 660019,
  },
  text: [
    {
      title: "WELL-READ",
      description:
        "Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        condition: {
          expression: "you've played a character with cost 5 or more this turn",
          type: "if",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "hnb-1",
      name: "WELL-READ",
      text: "WELL-READ Whenever this character quests, if you've played a character with cost 5 or more this turn, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ichabodCraneBookishSchoolmasterI18n,
};
