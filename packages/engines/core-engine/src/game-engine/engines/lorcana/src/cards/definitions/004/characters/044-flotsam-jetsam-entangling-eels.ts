import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flotsamAndJetsamEntanglingEels: LorcanaCharacterCardDefinition = {
  id: "pgn",
  missingTestCase: true,
  name: "Flotsam & Jetsam",
  additionalNames: ["Flotsam", "Jetsam"],
  title: "Entangling Eels",
  characteristics: ["floodborn", "ally"],
  text: "**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)_\n\n_(This character counts as being named both Flotsam and Jetsam)_",
  type: "character",
  abilities: [
    shiftAbility(
      [
        {
          type: "card",
          action: "discard",
          amount: 2,
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "self" },
            { filter: "source", value: "other" },
          ],
        } as any,
      ],
      ["Flotsam", "Jetsam"],
      "**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)_\n\n_(This character counts as being named both Flotsam and Jetsam)_",
    ),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Brian Kesinger",
  number: 44,
  set: "URR",
  rarity: "uncommon",
};
