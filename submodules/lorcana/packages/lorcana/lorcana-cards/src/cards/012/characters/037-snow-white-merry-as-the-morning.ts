import type { CharacterCard } from "@tcg/lorcana-types";
import { snowWhiteMerryAsTheMorningI18n } from "./037-snow-white-merry-as-the-morning.i18n";

export const snowWhiteMerryAsTheMorning: CharacterCard = {
  id: "EdS",
  canonicalId: "ci_EdS",
  reprints: ["set12-037"],
  cardType: "character",
  name: "Snow White",
  version: "Merry as the Morning",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 37,
  rarity: "legendary",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6253282cb5e14ec384482907b1b1aaa3",
  },
  text: [
    {
      title: "CLARION CALL",
      description:
        "Whenever this character quests, you may return chosen Seven Dwarfs character of yours to your hand to draw a card.",
    },
    {
      title: "NEVER FORGOTTEN",
      description:
        "During an opponent's turn, when this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "EdS-1",
      name: "Clarion Call",
      type: "triggered",
      text: "Clarion Call Whenever this character quests, you may return chosen Seven Dwarfs character of yours to your hand to draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "has-classification",
                    classification: "Seven Dwarfs",
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
            },
          ],
        },
      },
    },
    {
      id: "EdS-2",
      name: "Never Forgotten",
      type: "triggered",
      text: "Never Forgotten During an opponent's turn, when this character is banished in a challenge, return this card to your hand.",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "in-challenge",
          },
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      effect: {
        type: "return-to-hand",
        target: {
          ref: "self",
        },
      },
    },
  ],
  i18n: snowWhiteMerryAsTheMorningI18n,
};
