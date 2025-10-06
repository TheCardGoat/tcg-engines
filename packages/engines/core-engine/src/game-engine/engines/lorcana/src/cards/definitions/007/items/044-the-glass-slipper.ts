import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { searchTheKingdom } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const theGlassSlipper: LorcanaItemCardDefinition = {
  id: "lun",
  name: "The Glass Slipper",
  characteristics: ["item"],
  text: "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\n\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
  type: "item",
  abilities: [searchTheKingdom],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Tania Soler",
  number: 44,
  set: "007",
  rarity: "rare",
  cardCopyLimit: 2,
};
