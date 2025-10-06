import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { baymaxsChargingStationAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const baymaxsChargingStation: LorcanaItemCardDefinition = {
  id: "rwg",
  name: "Baymax's Charging Station",
  characteristics: ["item"],
  text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
  type: "item",
  abilities: [baymaxsChargingStationAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Juan Diego Leon",
  number: 180,
  set: "007",
  rarity: "common",
};
