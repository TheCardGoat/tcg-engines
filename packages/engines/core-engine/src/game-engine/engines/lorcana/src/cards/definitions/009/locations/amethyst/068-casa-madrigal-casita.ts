import { casaMadrigalCasita as ogCasaMadrigalCasita } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/67-casa-madrigal-casita";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const casaMadrigalCasita: LorcanaLocationCardDefinition = {
  ...ogCasaMadrigalCasita,
  id: "jx4",
  reprints: [ogCasaMadrigalCasita.id],
  number: 68,
  set: "009",
};
