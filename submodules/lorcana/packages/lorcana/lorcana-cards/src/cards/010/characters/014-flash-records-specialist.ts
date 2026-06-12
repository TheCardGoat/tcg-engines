import type { CharacterCard } from "@tcg/lorcana-types";
import { flashRecordsSpecialistI18n } from "./014-flash-records-specialist.i18n";

export const flashRecordsSpecialist: CharacterCard = {
  id: "dQW",
  canonicalId: "ci_dQW",
  reprints: ["set10-014"],
  cardType: "character",
  name: "Flash",
  version: "Records Specialist",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 14,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_08f33a2464654944a7424e6b5971033c",
    tcgPlayer: 659461,
  },
  text: [
    {
      title: "HOLD... YOUR HORSES",
      description: "This character enters play exerted.",
    },
    {
      title: "DEEP RESEARCH",
      description:
        "Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "dQW-1",
      name: "YOUR HORSES",
      text: "HOLD... YOUR HORSES This character enters play exerted.",
      type: "static",
    },
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          duration: "this-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "has-classification",
                classification: "Detective",
              },
            ],
          },
        },
      },
      id: "dQW-2",
      name: "DEEP RESEARCH",
      text: "DEEP RESEARCH Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: flashRecordsSpecialistI18n,
};
