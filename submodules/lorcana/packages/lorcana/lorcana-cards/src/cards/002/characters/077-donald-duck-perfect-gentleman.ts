import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckPerfectGentlemanI18n } from "./077-donald-duck-perfect-gentleman.i18n";

export const donaldDuckPerfectGentleman: CharacterCard = {
  id: "fS0",
  canonicalId: "ci_rpq",
  reprints: ["set2-077", "set9-085"],
  cardType: "character",
  name: "Donald Duck",
  version: "Perfect Gentleman",
  inkType: ["emerald"],
  set: "002",
  cardNumber: 77,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fbd5245e47044bc842780f9340d4ddd",
    tcgPlayer: 650025,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "ALLOW ME",
      description: "At the start of your turn, each player may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    {
      id: "wjj-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "wjj-2",
      name: "ALLOW ME",
      text: "ALLOW ME At the start of your turn, each player may draw a card.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
    },
    {
      id: "wjj-3",
      name: "ALLOW ME",
      text: "ALLOW ME At the start of your turn, each player may draw a card.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "OPPONENT",
        effect: {
          amount: 1,
          target: "OPPONENT",
          type: "draw",
        },
      },
    },
  ],
  i18n: donaldDuckPerfectGentlemanI18n,
};
