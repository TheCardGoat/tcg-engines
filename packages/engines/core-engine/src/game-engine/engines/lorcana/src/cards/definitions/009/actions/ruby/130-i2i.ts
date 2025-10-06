import type { CreateLayerBasedOnCondition } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { xOrMoreCharsSangThisSongCondition } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import {
  drawXCards,
  readyAndCantQuest,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerTogetherAbility";
import {
  opponent,
  self,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const conditionalEffects: CreateLayerBasedOnCondition = {
  type: "create-layer-based-on-condition",
  // TODO: Target not needed
  target: self,
  conditionalEffects: [
    {
      conditions: [xOrMoreCharsSangThisSongCondition(2)],
      effects: readyAndCantQuest({
        type: "card",
        value: "all",
        filters: [{ filter: "sing", value: "singer" }],
      }),
    },
  ],
};

export const i2i: LorcanaActionCardDefinition = {
  id: "e90",
  name: "I2I",
  characteristics: ["action", "song"],
  text: "Sing Together 9 (Any number of your or your teammates’ characters with total cost 9 or more may {E} to sing this song for free.)\nEach player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
  type: "action",
  inkwell: true,
  colors: ["ruby"],
  cost: 9,
  illustrator: "Erin Whelil",
  number: 130,
  set: "009",
  rarity: "rare",
  abilities: [
    singerTogetherAbility(9),
    {
      type: "resolution",
      text: "Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can’t quest for the rest of this turn.",
      effects: [
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: { type: "player", value: "self" },
        },
        {
          type: "lore",
          modifier: "add",
          amount: 2,
          target: { type: "player", value: "opponent" },
        },
        drawXCards(2, self),
        drawXCards(2, opponent),
        conditionalEffects,
      ],
    },
  ],
};
