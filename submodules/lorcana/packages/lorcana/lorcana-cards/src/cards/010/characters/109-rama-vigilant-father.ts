import type { CharacterCard } from "@tcg/lorcana-types";
import { ramaVigilantFatherI18n } from "./109-rama-vigilant-father.i18n";

export const ramaVigilantFather: CharacterCard = {
  id: "Y2X",
  canonicalId: "ci_Y2X",
  reprints: ["set10-109"],
  cardType: "character",
  name: "Rama",
  version: "Vigilant Father",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 109,
  rarity: "common",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_869c25119c0747c7a1de1cdbfff70eb0",
    tcgPlayer: 659600,
  },
  text: [
    {
      title: "PROTECTION OF THE PACK",
      description:
        "Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
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
              type: "ready",
              target: {
                selector: "self",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            type: "optional",
          },
          {
            condition: {
              type: "if-you-do",
            },
            then: {
              duration: "this-turn",
              restriction: "cant-quest",
              target: "SELF",
              type: "restriction",
            },
            type: "conditional",
          },
        ],
        type: "sequence",
      },
      id: "1d1-1",
      name: "PROTECTION OF THE PACK",
      text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
          excludeSelf: true,
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 5,
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ramaVigilantFatherI18n,
};
