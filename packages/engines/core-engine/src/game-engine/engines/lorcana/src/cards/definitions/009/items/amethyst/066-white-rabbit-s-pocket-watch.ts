import { whiteRabbitPocketWatch as ogWhiteRabbitPocketWatch } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/068-white-rabbit-pocket-watch";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whiteRabbitsPocketWatch: LorcanaItemCardDefinition = {
  ...ogWhiteRabbitPocketWatch,
  id: "u14",
  reprints: [ogWhiteRabbitPocketWatch.id],
  number: 66,
  set: "009",
};
