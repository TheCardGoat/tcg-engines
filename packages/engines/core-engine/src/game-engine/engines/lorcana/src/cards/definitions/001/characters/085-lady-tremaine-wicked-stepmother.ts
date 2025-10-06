import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyTremaine: LorcanitoCharacterCardDefinition = {
  id: "ucd",

  name: "Lady Tremaine",
  title: "Wicked Stepmother",
  characteristics: ["dreamborn", "villain"],
  text: "**Do it again!** When you play this character, you may return an action card from your discard to your hand.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      optional: true,
      name: "DO IT AGAIN!",
      text: "When you play this character, you may return an action card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          exerted: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "action" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  flavour: '"If your chores are done, then clearly you..."',
  colors: ["emerald"],
  cost: 6,
  strength: 1,
  willpower: 5,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 85,
  set: "TFC",
  rarity: "rare",
};
