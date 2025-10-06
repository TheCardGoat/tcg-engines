import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const belleBookworm: LorcanitoCharacterCardDefinition = {
  id: "num",
  name: "Belle",
  title: "Bookworm",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**USE YOUR IMAGINATION** While an opponent has no cards in their hand, this character gets +2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Use Your Imagination",
      text: "While an opponent has no cards in their hand, this character gets +2 {L}.",
      conditions: [{ type: "hand", amount: 0, player: "opponent" }],
      attribute: "lore",
      amount: 2,
    }),
  ],
  flavour: "There's nothing more tempting than a pile of unread books.",
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 71,
  set: "ROF",
  rarity: "uncommon",
};
