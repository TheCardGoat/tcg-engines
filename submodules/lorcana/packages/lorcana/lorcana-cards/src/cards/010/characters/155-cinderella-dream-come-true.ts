import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaDreamComeTrueI18n } from "./155-cinderella-dream-come-true.i18n";

export const cinderellaDreamComeTrue: CharacterCard = {
  id: "krh",
  canonicalId: "ci_fz8",
  slug: "lorcana-ci_fz8",
  printings: [
    {
      id: "set10-155",
      artId: "set10-155",
      setCode: "set10",
      collectorNumber: "155",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set10-155"],
  cardType: "character",
  name: "Cinderella",
  version: "Dream Come True",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "010",
  cardNumber: 155,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_3c235410b79145c080fa8e3b000a2c60",
    tcgPlayer: "660029",
  },
  text: [
    {
      title: "WHATEVER YOU WISH FOR",
      description:
        "At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "1sh-1",
      name: "WHATEVER YOU WISH FOR",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "played-character-with-classification",
        comparison: {
          operator: "gte",
          value: 1,
        },
        classification: "Princess",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              source: "hand",
              facedown: true,
              target: "CONTROLLER",
              type: "put-into-inkwell",
              exerted: false,
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                amount: 1,
                target: "CONTROLLER",
                type: "draw",
              },
            },
          ],
        },
      },
      text: "WHATEVER YOU WISH FOR At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
    },
  ],
  i18n: cinderellaDreamComeTrueI18n,
};
