import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lumiereHotheadedCandelabra: LorcanitoCharacterCardDefinition = {
  id: "r40",

  name: "Lumiere",
  title: "Hotheaded Candelabra",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour: "When things heat up, no one can hold a candle to him.",
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 2,
  illustrator: "Giulia Riva",
  number: 112,
  set: "ROF",
  rarity: "rare",
};
