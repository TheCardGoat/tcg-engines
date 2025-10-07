import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangValorousGeneral: LorcanaCharacterCardDefinition = {
  id: "wyb",
  name: "Li Shang",
  title: "Valorous General",
  characteristics: ["hero", "floodborn"],
  text: "**Shift: Discard a character card** _(You may discard a character card to play this on top of one of your characters named Li Shang.)_\n\n**LEAD THE CHARGE** Your characters with 4 {S} or more get +1 {L}.",
  type: "character",
  abilities: [
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "type", value: "character" },
          ],
        } as any,
      ],
      "Li Shang",
      "**Shift: Discard a character card**",
    ),
    {
      type: "static",
      ability: "effects",
      name: "Lead The Charge",
      text: "Your characters with 4 {S} or more get +1 {L}.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          modifier: "add",
          amount: 1,
          duration: "static",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "strength",
                comparison: { operator: "gte", value: 4 },
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Nicola Saviori",
  number: 112,
  set: "URR",
  rarity: "uncommon",
};
