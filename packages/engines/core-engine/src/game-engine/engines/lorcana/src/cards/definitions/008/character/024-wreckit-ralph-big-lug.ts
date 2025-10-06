import type {
  LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import {
  self,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

const backOnTrackAbility: ResolutionAbility = {
  type: "resolution",
  name: "BACK ON TRACK",
  text: "When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
  optional: true,
  effects: [
    {
      type: "move",
      to: "hand",
      exerted: false,
      shouldRevealMoved: true,
      conditions: [],
      target: {
        type: "card",
        value: 1,
        filters: [
          { filter: "zone", value: "discard" },
          { filter: "owner", value: "self" },
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["racer"] },
          {
            filter: "attribute",
            value: "cost",
            comparison: { operator: "lte", value: 6 },
          },
        ],
      },
      afterEffect: [
        {
          type: "create-layer-based-on-target",
          // required but not used
          target: thisCharacter,
          effects: [
            {
              type: "lore",
              modifier: "add",
              amount: 1,
              target: self,
            },
          ],
        },
      ],
    },
  ],
};

export const wreckitRalphBigLug: LorcanaCharacterCardDefinition = {
  id: "wwd",
  name: "Wreck-it Ralph",
  title: "Big Lug",
  characteristics: ["floodborn", "hero", "racer"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)\nBACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
  type: "character",
  abilities: [
    shiftAbility(5, "Wreck-It Ralph"),
    whenYouPlayThisCharacter({ ...backOnTrackAbility }),
    wheneverThisCharacterQuests({ ...backOnTrackAbility }),
  ],
  inkwell: false,
  colors: ["amber", "ruby"],
  cost: 7,
  strength: 7,
  willpower: 5,
  illustrator: "Javi Salas",
  number: 24,
  set: "008",
  rarity: "super_rare",
  lore: 1,
};
