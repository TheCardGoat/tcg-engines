import type { CharacterCard } from "@tcg/lorcana-types";
import { sidPhillipsToySurgeonI18n } from "./126-sid-phillips-toy-surgeon.i18n";

export const sidPhillipsToySurgeon: CharacterCard = {
  id: "lRX",
  canonicalId: "ci_lRX",
  reprints: ["set12-126"],
  cardType: "character",
  name: "Sid Phillips",
  version: "Toy Surgeon",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 126,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_332a65ff58c44154824ef79683a29116",
  },
  text: [
    {
      title: "PLAYTIME'S OVER",
      description:
        "When you play this character, you may banish another chosen character of yours. If you do, each opponent chooses and banishes one of their characters.",
    },
    {
      title: "DOUBLE PRIZES!",
      description: "During your turn, whenever a Toy character is banished, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "Esk-1",
      name: "PLAYTIME'S OVER",
      type: "triggered",
      text: "PLAYTIME'S OVER When you play this character, you may banish another chosen character of yours. If you do, each opponent chooses and banishes one of their characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "for-each-opponent",
                effect: {
                  type: "banish",
                  chosenBy: "opponent",
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "opponent",
                    zones: ["play"],
                    cardTypes: ["character"],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      id: "Esk-2",
      name: "DOUBLE PRIZES!",
      type: "triggered",
      text: "DOUBLE PRIZES! During your turn, whenever a Toy character is banished, gain 2 lore.",
      trigger: {
        event: "banish",
        on: {
          controller: "any",
          cardType: "character",
          classification: "Toy",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "gain-lore",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: sidPhillipsToySurgeonI18n,
};
