import {
  drawXCards,
  mayBanish,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacterOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};

export const dinnerBell: LorcanaItemCardDefinition = {
  id: "s78",
  reprints: ["box"],

  name: "Dinner Bell",
  characteristics: ["item"],
  text: "**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "You Know What Happens",
      text: "{E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "create-layer-based-on-target",
          target: chosenCharacterOfYours,
          resolveAmountBeforeCreatingLayer: true,
          effects: [
            drawXCards({
              dynamic: true,
              target: { attribute: "damage" },
            }),
          ],
        },
        mayBanish(chosenCharacterOfYours),
      ],
    },
  ],

  flavour: "The delicate sound of impending doom.",
  colors: ["ruby"],
  cost: 4,
  illustrator: "Peter Brockhammer",
  number: 134,
  set: "ROF",
  rarity: "rare",
};
