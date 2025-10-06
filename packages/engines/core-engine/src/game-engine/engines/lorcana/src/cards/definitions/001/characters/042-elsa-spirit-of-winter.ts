import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { exertAndCantReady } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaSpiritOfWinter: LorcanaCharacterCardDefinition = {
  id: "qc4",
  reprints: ["qun"],
  name: "Elsa",
  title: "Spirit of Winter",
  characteristics: ["hero", "floodborn", "queen", "sorcerer"],
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Elsa.)_\n\n**DEEP FREEZE** When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
  type: "character",
  abilities: [
    shiftAbility(6, "Elsa"),
    whenYouPlayThisCharAbility({
      type: "resolution",
      optional: true,
      name: "DEEP FREEZE",
      text: "When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.",
      effects: exertAndCantReady({
        type: "card",
        value: 2,
        upTo: true,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      }),
    }),
  ],
  flavour: "Ice is stronger than you may think.",
  colors: ["amethyst"],
  cost: 8,
  strength: 4,
  willpower: 6,
  lore: 3,
  illustrator: "Matthew Robert Davies",
  number: 42,
  set: "TFC",
  rarity: "legendary",
};
