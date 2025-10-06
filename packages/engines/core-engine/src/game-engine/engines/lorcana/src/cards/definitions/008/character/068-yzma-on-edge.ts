import { ifYouHaveACardInYourDiscardNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaOnEdge: LorcanaCharacterCardDefinition = {
  id: "q93",
  name: "Yzma",
  title: "On Edge",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "WHY DO WE EVEN HAVE THAT LEVER?",
      text: "When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      optional: true,
      conditions: [ifYouHaveACardInYourDiscardNamed("Pull the Lever!")],
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "shuffle-deck",
          target: self,
        },
        {
          type: "move",
          to: "hand",
          isPrivate: false,
          shouldRevealMoved: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "deck" },
              { filter: "owner", value: "self" },
              {
                filter: "attribute",
                value: "name",
                comparison: {
                  operator: "eq",
                  value: "Wrong Lever!",
                },
              },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "emerald"],
  cost: 6,
  strength: 3,
  willpower: 6,
  illustrator: "Julien Yvardis",
  number: 68,
  set: "008",
  rarity: "super_rare",
  lore: 2,
};
