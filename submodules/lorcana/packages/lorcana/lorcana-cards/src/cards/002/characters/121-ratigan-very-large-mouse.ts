import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganVeryLargeMouseI18n } from "./121-ratigan-very-large-mouse.i18n";

export const ratiganVeryLargeMouse: CharacterCard = {
  id: "jfe",
  canonicalId: "ci_jfe",
  reprints: ["set2-121"],
  cardType: "character",
  name: "Ratigan",
  version: "Very Large Mouse",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 121,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_35af0ddde9834b5e8b37b9ba98126c71",
    tcgPlayer: 527276,
  },
  text: [
    {
      title: "THIS IS MY KINGDOM",
      description:
        "When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: "CHOSEN_OPPOSING_CHARACTER_3_STRENGTH_OR_LESS",
          },
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "restriction",
            duration: "this-turn",
            restriction: "cant-quest",
            target: { ref: "previous-target" },
          },
        ],
      },
      id: "1wj-1",
      name: "THIS IS MY KINGDOM",
      text: "THIS IS MY KINGDOM When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: ratiganVeryLargeMouseI18n,
};
