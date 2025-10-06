import { opponentDrawXCards } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const earthGiantLivingMountain: LorcanaCharacterCardDefinition = {
  id: "k6x",
  name: "Earth Giant",
  title: "Living Mountain",
  characteristics: ["storyborn", "ally"],
  text: "**UNEARTHED** When you play this character, each opponent draws a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "UNEARTHED",
      text: "When you play this character, each opponent draws a card.",
      effects: [opponentDrawXCards(1)],
    },
  ],
  flavour: "Who woke up the big guy?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Alice Pisoni",
  number: 41,
  set: "SSK",
  rarity: "common",
};
