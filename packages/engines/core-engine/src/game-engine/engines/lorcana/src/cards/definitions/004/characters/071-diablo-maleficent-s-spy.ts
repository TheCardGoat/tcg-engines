import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const diabloMaleficentsSpy: LorcanaCharacterCardDefinition = {
  id: "b9t",
  name: "Diablo",
  title: "Maleficent's Spy",
  characteristics: ["storyborn", "ally"],
  text: "**SCOUT AHEAD** When you play this character, you may look at each opponent's hand.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Scout Ahead",
      text: "When you play this character, you may look at each opponent's hand.",
      effects: [opponentRevealHand],
    },
  ],
  flavour:
    "Keep an eye on the sea witch, my pet. Tell me everything. −Maleficent",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Ellie Horie",
  number: 71,
  set: "URR",
  rarity: "common",
};
