import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cheshireCatFromTheShadows: LorcanitoCharacterCardDefinition = {
  id: "ebw",

  name: "Cheshire Cat",
  title: "From the Shadows",
  characteristics: ["floodborn"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)_\n\n**Evasive** (_Only characters with Evasive can challenge this character._)\n\n**WICKED SMILE** {E} − Banish chosen damaged character.",
  type: "character",
  abilities: [
    shiftAbility(5, "cheshire cat"),
    evasiveAbility,
    {
      type: "activated",
      name: "Wicked Smile",
      text: "{E} − Banish chosen damaged character.",
      optional: false,
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 8,
  strength: 5,
  willpower: 6,
  lore: 2,
  illustrator: "Jeff Murchie",
  number: 75,
  set: "ROF",
  rarity: "super_rare",
};
