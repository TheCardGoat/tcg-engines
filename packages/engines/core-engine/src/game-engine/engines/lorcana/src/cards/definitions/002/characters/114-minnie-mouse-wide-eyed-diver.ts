import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseWideEyedDiver: LorcanitoCharacterCardDefinition = {
  id: "whf",
  name: "Minnie Mouse",
  title: "Wide-Eyed Diver",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 2 _You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)_\n\n**Evasive** (_Only characters with Evasive can challenge this character._)\n\n**UNDERSEA ADVENTURE** Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
  type: "character",
  abilities: [
    shiftAbility(2, "minnie mouse"),
    evasiveAbility,
    wheneverPlays({
      name: "Undersea Adventure",
      text: "Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "owner", value: "self" },
          {
            filter: "turn",
            value: "played",
            targetFilter: [{ filter: "type", value: "action" }],
            comparison: { operator: "eq", value: 2 },
          },
        ],
      },
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "Look at this stuff, isn't it neat?",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Bill Robinson",
  number: 114,
  set: "ROF",
  rarity: "rare",
};
