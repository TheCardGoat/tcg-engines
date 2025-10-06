import { atlanticaConcertHall as ogAtlanticaConcertHall } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/33-atlantica-concert-hall";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const atlanticaConcertHall: LorcanaLocationCardDefinition = {
  ...ogAtlanticaConcertHall,
  id: "wzf",
  reprints: [ogAtlanticaConcertHall.id],
  number: 34,
  set: "009",
};
