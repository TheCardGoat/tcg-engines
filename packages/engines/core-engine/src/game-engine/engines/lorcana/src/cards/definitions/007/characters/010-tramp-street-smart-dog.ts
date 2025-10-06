import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  whenYouPlayThis,
  whenYouPlayThisForEachYouPayLess,
} from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trampStreetSmartDog: LorcanaCharacterCardDefinition = {
  id: "yua",
  name: "Tramp",
  title: "Street-Smart Dog",
  characteristics: ["storyborn", "hero"],
  text: "NOW IT'S A PARTY For each character you have in play, you pay {I} less to play this character. HOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and ddiscard that many cards.",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "NOW IT'S A PARTY",
      text: "For each character you have in play, you pay {I} less to play this character.",
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
    }),
    whenYouPlayThis({
      name: "HOW'S PICKINGS?",
      text: "When you play this character, you may draw a card for each of your other characters in play. Then choose the same number of cards from your hand and discard them.",
      resolveEffectsIndividually: true,
      optional: true,
      effects: [
        {
          type: "draw",
          amount: {
            dynamic: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "source", value: "other" },
            ],
          },
          target: self,
        },
        {
          type: "discard",
          amount: {
            dynamic: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "source", value: "other" },
            ],
          },
          target: {
            type: "card",
            value: {
              dynamic: true,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "source", value: "other" },
              ],
            },
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald", "amber"],
  cost: 7,
  strength: 2,
  willpower: 6,
  illustrator: "Alan Batson",
  number: 10,
  set: "007",
  rarity: "rare",
  lore: 2,
};
