import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteBadGuy: LorcanitoCharacterCardDefinition = {
  id: "rsd",
  name: "Pete",
  title: "Bad Guy",
  characteristics: ["storyborn", "villain"],
  text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**TAKE THAT!** Whenever you play an action, this character gets +2 {S} this turn.\n\n**WHO'S NEXT** While this character has 7 {S} or more, he gets +2 {L}.",
  type: "character",
  abilities: [
    wardAbility,
    wheneverPlays({
      name: "Take That!",
      text: "Whenever you play an action, this character gets +2 {S} this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "characteristics", value: ["action"] },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
    whileConditionThisCharacterGets({
      name: "Who's Next",
      text: "While this character has 7 {S} or more, he gets +2 {L}.",
      attribute: "lore",
      amount: 2,
      conditions: [
        {
          type: "attribute",
          attribute: "strength",
          comparison: { operator: "gte", value: 7 },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Hedvig Häggman-Sund",
  number: 88,
  set: "ROF",
  rarity: "rare",
};
