import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fixitFelixJrNicelandSteward: LorcanaCharacterCardDefinition = {
  id: "vqf",
  name: "Fix‐It Felix, Jr.",
  title: "Niceland Steward",
  characteristics: ["hero", "floodborn"],
  text: "**Shift 3** _(You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)_ \n**BUILDING TOGETHER** Your locations get +2 {W}.",
  type: "character",
  abilities: [
    shiftAbility(3, "Fix-It Felix, Jr."),
    {
      type: "static",
      ability: "effects",
      name: "BUILDING TOGETHER",
      text: "Your locations get +2 {W}.",
      effects: [
        {
          type: "attribute",
          attribute: "willpower",
          amount: 2,
          modifier: "add",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "owner", value: "self" },
              { filter: "type", value: "location" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Jidao Moara",
  number: 12,
  set: "SSK",
  rarity: "uncommon",
};
