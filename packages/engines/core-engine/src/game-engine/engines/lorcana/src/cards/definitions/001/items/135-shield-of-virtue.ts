import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { readyAndCantQuest } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const shieldOfVirtue: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "pn4",

  name: "Shield of Virtue",
  text: "**FIREPROOF** {E}, 3 {I} − Ready chosen character. They can't quest for the rest of this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Fireproof",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
      effects: readyAndCantQuest(chosenCharacter),
    } as ActivatedAbility,
  ],
  flavour:
    "Arm thyself with this enchanted Shield of Virtue and this mighty Sword of Truth, for these weapons of righteousness will triumph over evil. \n−Flora",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Eri Welli",
  number: 135,
  set: "TFC",
  rarity: "uncommon",
};
