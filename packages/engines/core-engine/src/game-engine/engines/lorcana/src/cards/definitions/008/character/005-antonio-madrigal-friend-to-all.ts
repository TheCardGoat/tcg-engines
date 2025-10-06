import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverOneOfYourCharactersSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const antonioMadrigalFriendToAll: LorcanaCharacterCardDefinition = {
  id: "i29",
  name: "Antonio Madrigal",
  title: "Friend to All",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "OF COURSE THEY CAN COME Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharactersSings({
      name: "OF COURSE THEY CAN COME",
      text: "Once during your turn, whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      optional: true,
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: [
        {
          type: "move",
          to: "hand",
          shouldRevealMoved: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: {
                  operator: "lte",
                  value: 3,
                },
              },
            ],
          },
        },
        {
          type: "shuffle-deck",
          target: self,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber", "amethyst"],
  cost: 4,
  strength: 2,
  willpower: 2,
  illustrator: "Valerio Buonfantino",
  number: 5,
  set: "008",
  rarity: "rare",
  lore: 1,
};
