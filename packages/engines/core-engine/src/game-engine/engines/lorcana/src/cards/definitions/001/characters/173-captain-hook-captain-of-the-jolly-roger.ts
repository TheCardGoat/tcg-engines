import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookCaptainOfTheJollyRoger: LorcanitoCharacterCardDefinition =
  {
    id: "z5q",
    reprints: ["kc5"],

    name: "Captain Hook",
    title: "Captain of the Jolly Roger",
    characteristics: ["storyborn", "villain", "pirate", "captain"],
    text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
    type: "character",
    abilities: [
      whenYouPlayThisCharAbility({
        type: "resolution",
        optional: true,
        name: "DOUBLE THE POWDER!",
        text: "When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
        effects: [
          {
            type: "move",
            to: "hand",
            exerted: false,
            target: {
              type: "card",
              value: 1,
              filters: [
                {
                  filter: "attribute",
                  value: "name",
                  comparison: { operator: "eq", value: "Fire the Cannons!" },
                },
                { filter: "zone", value: "discard" },
                { filter: "owner", value: "self" },
              ],
            },
          },
        ],
      }),
    ],
    flavour: "A pretty sight, Mr. Smee. We’ll pot ’em like sitting \rducks.",
    colors: ["steel"],
    cost: 4,
    strength: 3,
    willpower: 4,
    lore: 1,
    illustrator: "Adrianne Gumaya",
    number: 173,
    set: "TFC",
    rarity: "rare",
  };
