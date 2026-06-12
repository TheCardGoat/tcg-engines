import type { CharacterCard } from "@tcg/lorcana-types";
import { annaDiplomaticQueenI18n } from "./085-anna-diplomatic-queen.i18n";

export const annaDiplomaticQueen: CharacterCard = {
  id: "Tqp",
  canonicalId: "ci_Tqp",
  reprints: ["set5-085"],
  cardType: "character",
  name: "Anna",
  version: "Diplomatic Queen",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 85,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e572046b12da49769e2e492828d61636",
    tcgPlayer: 561472,
  },
  text: [
    {
      title: "ROYAL RESOLUTION",
      description: "When you play this character, you may pay 2 {I} to choose one:",
    },
    {
      title: "• Each opponent chooses and discards a card.",
    },
    {
      title: "• Chosen character gets +2 {S} this turn.",
    },
    {
      title: "• Banish chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
  abilities: [
    {
      id: "Tqp-1",
      name: "ROYAL RESOLUTION",
      text: "ROYAL RESOLUTION When you play this character, you may pay 2 {I} to choose one: Each opponent chooses and discards a card. Chosen character gets +2 {S} this turn. Banish chosen damaged character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "choice",
          optionLabels: [
            "Each opponent chooses and discards a card.",
            "Chosen character gets +2 strength this turn.",
            "Banish chosen damaged character.",
          ],
          options: [
            {
              type: "pay-cost",
              cost: {
                ink: 2,
              },
              effect: {
                type: "discard",
                from: "hand",
                amount: 1,
                chosen: true,
                chosenBy: "opponent",
                target: "OPPONENT",
              },
            },
            {
              type: "pay-cost",
              cost: {
                ink: 2,
              },
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
                },
              },
            },
            {
              type: "pay-cost",
              cost: {
                ink: 2,
              },
              effect: {
                type: "banish",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                  filter: [
                    {
                      type: "damaged",
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: annaDiplomaticQueenI18n,
};
