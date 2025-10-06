import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { aurelianGyrosensor as ogAurelianGyrosensor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/163-aurelian-gyrosensor";

export const aurelianGyrosensor: LorcanaItemCardDefinition = {
  ...ogAurelianGyrosensor,
  id: "dbv",
  reprints: [ogAurelianGyrosensor.id],
  number: 167,
  set: "009",
};
