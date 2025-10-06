import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chipQuickThinker: LorcanaCharacterCardDefinition = {
  id: "p4b",
  name: "Chip",
  title: "Quick Thinker",
  characteristics: ["storyborn", "hero"],
  text: "I'LL HANDLE IT When you play this character, choose an opponent to discard a card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "I'LL HANDLE IT",
      text: "When you play this character, choose an opponent to discard a card.",
      responder: "opponent",
      effects: [discardACard],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 2,
  illustrator: "Brian Weiss",
  number: 97,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
