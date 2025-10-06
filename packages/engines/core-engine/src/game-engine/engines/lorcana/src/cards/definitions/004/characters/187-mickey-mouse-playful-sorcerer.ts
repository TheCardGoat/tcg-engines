import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMousePlayfulSorcerer: LorcanaCharacterCardDefinition = {
  id: "i3q",
  name: "Mickey Mouse",
  title: "Playful Sorcerer",
  characteristics: ["hero", "floodborn", "sorcerer"],
  text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse)_\n<br>\n**Resist** +1 _(Damage dealt to this character is reduced by 1.)_\n<br>\n**SWEEP AWAY** When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
  type: "character",
  abilities: [
    shiftAbility(3, "Mickey Mouse"),
    resistAbility(1),
    {
      type: "resolution",
      name: "SWEEP AWAY",
      text: "When you play this character, deal damage to chosen character equal to the number of Broom characters you have in play.",
      effects: [
        {
          type: "damage",
          amount: {
            dynamic: true,
            filters: [
              { filter: "characteristics", value: ["broom"] },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Alice Pisoni",
  number: 187,
  set: "URR",
  rarity: "rare",
};
