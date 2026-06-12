import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsOnTheCaseI18n } from "./137-judy-hopps-on-the-case.i18n";

export const judyHoppsOnTheCase: CharacterCard = {
  id: "MPo",
  canonicalId: "ci_MPo",
  reprints: ["set10-137"],
  cardType: "character",
  name: "Judy Hopps",
  version: "On the Case",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 137,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_23a4b454b25c4c2f98c8e42664bc2394",
    tcgPlayer: 659617,
  },
  text: [
    {
      title: "HIDDEN CLUES",
      description:
        "When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
  abilities: [
    {
      condition: {
        type: "has-character-count",
        classification: "Detective",
        controller: "you",
        count: 2,
        comparison: "greater-or-equal",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          facedown: true,
          exerted: true,
        },
        type: "optional",
      },
      id: "MPo-1",
      name: "HIDDEN CLUES",
      text: "HIDDEN CLUES When you play this character, if you have another Detective character in play, you may put chosen item into its player's inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: judyHoppsOnTheCaseI18n,
};
