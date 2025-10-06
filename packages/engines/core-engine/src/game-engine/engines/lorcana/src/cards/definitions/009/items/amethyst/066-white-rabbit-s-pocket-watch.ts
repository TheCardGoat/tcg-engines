import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { whiteRabbitPocketWatch as ogWhiteRabbitPocketWatch } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/068-white-rabbit-pocket-watch";

export const whiteRabbitsPocketWatch: LorcanaItemCardDefinition = {
  ...ogWhiteRabbitPocketWatch,
  id: "u14",
  reprints: [ogWhiteRabbitPocketWatch.id],
  number: 66,
  set: "009",
};
