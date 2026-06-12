import type { CharacterCard } from "@tcg/lorcana-types";
import { fixitFelixJrPintsizedHeroI18n } from "./022-fix-it-felix-jr-pint-sized-hero.i18n";

export const fixitFelixJrPintsizedHero: CharacterCard = {
  id: "zSu",
  canonicalId: "ci_zSu",
  reprints: ["set7-022"],
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Pint-Sized Hero",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 22,
  rarity: "uncommon",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8e4e89a1b49c4ea5936be4e14cfadb46",
    tcgPlayer: 619417,
  },
  text: [
    {
      title: "LET'S GET TO WORK",
      description:
        "Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Racer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                cardTypes: ["character"],
                zones: ["play"],
                filter: [
                  {
                    type: "has-classification",
                    classification: "Racer",
                  },
                ],
              },
              type: "ready",
            },
            {
              duration: "this-turn",
              restriction: "cant-quest",
              target: {
                reference: "selected-first",
              },
              type: "restriction",
            },
          ],
        },
        type: "optional",
      },
      id: "b28-1",
      name: "LET'S GET TO WORK",
      text: "LET'S GET TO WORK Whenever you return a Racer character card from your discard to your hand, you may ready chosen Racer character. They can't quest for the rest of this turn.",
      trigger: {
        event: "leave-discard",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Racer",
        },
        restrictions: [
          {
            type: "to-hand",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fixitFelixJrPintsizedHeroI18n,
};
