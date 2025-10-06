import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { casaMadrigalCasita as ogCasaMadrigalCasita } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/67-casa-madrigal-casita";

export const casaMadrigalCasita: LorcanaLocationCardDefinition = {
  ...ogCasaMadrigalCasita,
  id: "jx4",
  reprints: [ogCasaMadrigalCasita.id],
  number: 68,
  set: "009",
};
