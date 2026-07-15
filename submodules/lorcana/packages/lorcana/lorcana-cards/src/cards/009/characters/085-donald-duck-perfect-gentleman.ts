import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckPerfectGentlemanI18n } from "./085-donald-duck-perfect-gentleman.i18n";

export const donaldDuckPerfectGentleman: CharacterCard = {
  id: "ASG",
  canonicalId: "ci_rpq",
  slug: "lorcana-ci_rpq",
  printings: [
    {
      id: "set9-085",
      artId: "set9-085",
      setCode: "set9",
      collectorNumber: "85",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set2-077", "set9-085"],
  cardType: "character",
  name: "Donald Duck",
  version: "Perfect Gentleman",
  inkType: ["emerald"],
  set: "009",
  cardNumber: 85,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0fbd5245e47044bc842780f9340d4ddd",
    tcgPlayer: "650025",
  },
  text: [
    {
      title: "Shift 3 {I}",
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
