import {
  resistAbility,
  shiftAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const heiheiExpandedConsciousness: LorcanitoCharacterCard = {
  id: "puo",
  name: "Heihei",
  title: "Expanded Consciousness",
  characteristics: ["floodborn", "ally"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    shiftAbility(3, "Heihei"),
    resistAbility(1),
    whenYouPlayThis({
      name: "CLEAR YOUR MIND",
      text: "When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 1,
  willpower: 5,
  illustrator: "Maxine Vee",
  number: 163,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
