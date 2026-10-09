import type { CharacterCard } from "@tcg/lorcana-types";
import { honeyLemonTestingTheLimitsI18n } from "./093-honey-lemon-testing-the-limits.i18n";

export const honeyLemonTestingTheLimits: CharacterCard = {
  id: "K86",
  canonicalId: "ci_K86",
  slug: "lorcana-ci_K86",
  printings: [
    {
      id: "set14-093",
      artId: "set14-093",
      setCode: "set14",
      collectorNumber: "93",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-093"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Testing the Limits",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 93,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a3e52e47f3d942a6a0189244f2611c18",
  },
  text: [
    {
      title: "ADVANCED CHEMISTRY",
      description:
        "When you play this character and whenever she quests, you may banish chosen item of yours. If you do, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero", "Inventor"],
  abilities: [
    {
      id: "res-93-1",
      name: "ADVANCED CHEMISTRY",
      type: "triggered",
      text: "ADVANCED CHEMISTRY When you play this character and whenever she quests, you may banish chosen item of yours. If you do, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
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
                cardTypes: ["item"],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    amount: 1,
                    target: "CONTROLLER",
                  },
                  {
                    type: "gain-ink-drop",
                    amount: 1,
                    target: "CONTROLLER",
                  },
                ],
              },
            },
          ],
        },
      },
    },
    {
      id: "res-93-2",
      name: "ADVANCED CHEMISTRY",
      type: "triggered",
      text: "ADVANCED CHEMISTRY When you play this character and whenever she quests, you may banish chosen item of yours. If you do, draw a card and get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
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
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    amount: 1,
                    target: "CONTROLLER",
                  },
                  {
                    type: "gain-ink-drop",
                    amount: 1,
                    target: "CONTROLLER",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ],
  i18n: honeyLemonTestingTheLimitsI18n,
};
