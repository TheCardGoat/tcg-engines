import type { CharacterCard } from "@tcg/lorcana-types";
import { magicaDeSpellShadowFormI18n } from "./066-magica-de-spell-shadow-form.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const magicaDeSpellShadowForm: CharacterCard = {
  id: "dre",
  canonicalId: "ci_dre",
  reprints: ["set8-066"],
  cardType: "character",
  name: "Magica De Spell",
  version: "Shadow Form",
  inkType: ["amethyst", "emerald"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_67e61d2f97084cb69e58b70c2a5d90d4",
    tcgPlayer: 632709,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "DANCE OF DARKNESS",
      description:
        "When you play this character, you may return one of your other characters to your hand to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    evasive,
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              steps: [
                {
                  target: {
                    cardTypes: ["character"],
                    count: 1,
                    excludeSelf: true,
                    owner: "you",
                    selector: "chosen",
                    zones: ["play"],
                  },
                  type: "return-to-hand",
                },
                {
                  condition: {
                    type: "if-you-do",
                  },
                  then: {
                    amount: 1,
                    type: "draw",
                  },
                  type: "conditional",
                },
              ],
              type: "sequence",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      id: "sma-2",
      name: "DANCE OF DARKNESS",
      text: "DANCE OF DARKNESS When you play this character, you may return one of your other characters to your hand to draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: magicaDeSpellShadowFormI18n,
};
