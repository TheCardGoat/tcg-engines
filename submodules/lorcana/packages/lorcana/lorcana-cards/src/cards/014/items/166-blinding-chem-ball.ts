import type { ItemCard } from "@tcg/lorcana-types";
import { blindingChemBallI18n } from "./166-blinding-chem-ball.i18n";

export const blindingChemBall: ItemCard = {
  id: "FkS",
  canonicalId: "ci_FkS",
  slug: "lorcana-ci_FkS",
  printings: [
    {
      id: "set14-166",
      artId: "set14-166",
      setCode: "set14",
      collectorNumber: "166",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-166"],
  cardType: "item",
  name: "Blinding Chem Ball",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 166,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  abilities: [
    {
      id: "FkS-1",
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
      id: "FkS-2",
      name: "Brilliant Burst",
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
              type: "modify-stat",
              stat: "strength",
              modifier: -2,
              duration: "this-turn",
              target: "CHOSEN_CHARACTER",
            },
          ],
        },
      },
      sourceZones: ["play"],
      text: "Brilliant Burst During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character gets -2 {S} this turn. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  text: [
    {
      title: "Destabilize",
      description: "{E}, 2 {I} — Banish this item.",
    },
    {
      title: "Brilliant Burst",
      description:
        "During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character gets -2 {S} this turn. (You may remove an ink drop to pay 1 {I}.)",
    },
  ],
  i18n: blindingChemBallI18n,
};
