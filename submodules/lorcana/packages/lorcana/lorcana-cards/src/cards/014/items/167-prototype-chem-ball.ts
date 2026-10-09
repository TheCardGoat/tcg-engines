import type { ItemCard } from "@tcg/lorcana-types";
import { prototypeChemBallI18n } from "./167-prototype-chem-ball.i18n";

export const prototypeChemBall: ItemCard = {
  id: "oxw",
  canonicalId: "ci_oxw",
  slug: "lorcana-ci_oxw",
  printings: [
    {
      id: "set14-167",
      artId: "set14-167",
      setCode: "set14",
      collectorNumber: "167",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-167"],
  cardType: "item",
  name: "Prototype Chem Ball",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 167,
  rarity: "common",
  cost: 1,
  inkable: true,
  abilities: [
    {
      id: "oxw-1",
      name: "Destabilize",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [],
      },
      text: "Destabilize {E}, 2 {I} — Banish this item.",
    },
    {
      id: "oxw-2",
      name: "Enigma Burst",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "gain-ink-drop",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "gain-keyword",
              keyword: "Resist",
              value: 1,
              duration: "until-start-of-next-turn",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          ],
        },
      },
      sourceZones: ["play"],
      text: "Enigma Burst During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character of yours gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1. You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  text: [
    {
      title: "Destabilize",
      description: "{E}, 2 {I} — Banish this item.",
    },
    {
      title: "Enigma Burst",
      description:
        "During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character of yours gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1. You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  i18n: prototypeChemBallI18n,
};
