import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodSneakySleuth: LorcanitoCharacterCardDefinition = {
  id: "d17",
  missingTestCase: true,
  name: "Robin Hood",
  title: "Sneaky Sleuth",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)_ **CLEVER PLAN** This character gets +1 {L} for each opposing damaged character in play._ **",
  type: "character",
  abilities: [
    shiftAbility(3, "Robin Hood"),
    {
      type: "static",
      ability: "effects",
      name: "Clever Plan",
      text: "This character gets +1 {L} for each opposing damaged character in play.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: {
            dynamic: true,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              {
                filter: "status",
                value: "damage",
                comparison: { operator: "gte", value: 1 },
              },
              { filter: "owner", value: "opponent" },
            ],
          },
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 88,
  set: "SSK",
  rarity: "uncommon",
};
