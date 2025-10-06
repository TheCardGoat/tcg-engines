import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { wheneverOpponentDrawsACard } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const diabloDevotedHerald: LorcanaCharacterCardDefinition = {
  id: "hxs",
  name: "Diablo",
  title: "Devoted Herald",
  characteristics: ["floodborn", "ally"],
  text: "**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)_\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**CIRCLE FAR AND WIDE** During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
  type: "character",
  abilities: [
    evasiveAbility,
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 1,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "type", value: "action" },
          ],
        },
      ],
      "Diablo",
      "**Shift: Discard an action card** _(You may discard an action card to play this on top of one of your characters named Diablo.)_",
    ),
    wheneverOpponentDrawsACard({
      name: "Circle far and wide",
      text: "During each opponent's turn, whenever they draw a card while this character is exerted, you may draw a card.",
      optional: true,
      effects: [drawACard],
      conditions: [
        { type: "exerted" },
        {
          type: "during-turn",
          value: "opponent",
        },
      ],
    }),
  ],
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 70,
  set: "URR",
  rarity: "legendary",
};
