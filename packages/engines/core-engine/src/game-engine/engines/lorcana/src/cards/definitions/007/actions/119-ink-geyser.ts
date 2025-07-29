import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { inkGeyserAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const inkGeyser: LorcanaActionCardDefinition = {
  id: "jvg",
  name: "Ink Geyser",
  characteristics: ["action"],
  text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
  type: "action",
  abilities: inkGeyserAbility,
  inkwell: false,
  colors: ["emerald", "sapphire"],
  cost: 3,
  illustrator: "Kevin Sidharta",
  number: 119,
  set: "007",
  rarity: "rare",
};
