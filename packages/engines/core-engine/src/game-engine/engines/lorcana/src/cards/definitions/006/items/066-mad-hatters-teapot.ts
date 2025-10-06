import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { noRoomNoRoom } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const madHattersTeapot: LorcanaItemCardDefinition = {
  id: "n9n",
  name: "Mad Hatter's Teapot",
  characteristics: ["item"],
  text: "**NO ROOM, NO ROOM**, {E}, 1 {I} – Each opponent puts the top card of their deck into their discard.",
  type: "item",
  abilities: [noRoomNoRoom],
  flavour:
    "Alice: My goodness, the tea missed the cup! \nMad Hatter: No, no, my dear—the cup missed the tea!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,

  illustrator: "Andrea Parisi",
  number: 66,
  set: "006",
  rarity: "common",
};
