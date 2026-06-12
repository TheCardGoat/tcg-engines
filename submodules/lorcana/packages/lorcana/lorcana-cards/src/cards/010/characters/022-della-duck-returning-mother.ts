import type { CharacterCard } from "@tcg/lorcana-types";
import { dellaDuckReturningMotherI18n } from "./022-della-duck-returning-mother.i18n";

export const dellaDuckReturningMother: CharacterCard = {
  id: "p1c",
  canonicalId: "ci_p1c",
  reprints: ["set10-022"],
  cardType: "character",
  name: "Della Duck",
  version: "Returning Mother",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 22,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_93548601e4fd42fcb0d385947c09fc8e",
    tcgPlayer: 658334,
  },
  text: [
    {
      title: "HERE TO HELP",
      description:
        "When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "ready",
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "any",
                    zones: ["play"],
                    cardTypes: ["character"],
                    filter: [
                      {
                        type: "has-keyword",
                        keyword: "Boost",
                      },
                    ],
                  },
                },
                {
                  duration: "this-turn",
                  restriction: "cant-quest",
                  target: "CHOSEN_CHARACTER",
                  type: "restriction",
                },
                {
                  duration: "this-turn",
                  restriction: "cant-challenge",
                  target: "CHOSEN_CHARACTER",
                  type: "restriction",
                },
              ],
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "27n-1",
      name: "HERE TO HELP",
      text: "HERE TO HELP When you play this character, you may ready chosen character with Boost. If you do, they can't quest or challenge for the rest of this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dellaDuckReturningMotherI18n,
};
