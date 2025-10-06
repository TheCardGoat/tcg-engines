import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madDogKarnagesFirstMate: LorcanaCharacterCardDefinition = {
  id: "a0y",
  name: "Mad Dog",
  title: "Karnage's First Mate",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
  type: "character",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "ARE YOU SURE THIS IS SAFE, CAPTAIN?",
      text: "If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
      amount: {
        dynamic: true,
        filterMultiplier: 1,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "zone", value: "play" },
          {
            filter: "attribute",
            value: "name",
            comparison: {
              operator: "eq",
              value: "Don Karnage",
            },
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 4,
  willpower: 4,
  illustrator: "Luis Huerta",
  number: 93,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
