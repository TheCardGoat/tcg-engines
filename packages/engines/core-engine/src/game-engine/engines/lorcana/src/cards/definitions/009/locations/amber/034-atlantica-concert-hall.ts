import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { atlanticaConcertHall as ogAtlanticaConcertHall } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations/33-atlantica-concert-hall";

export const atlanticaConcertHall: LorcanaLocationCardDefinition = {
  ...ogAtlanticaConcertHall,
  id: "wzf",
  reprints: [ogAtlanticaConcertHall.id],
  number: 34,
  set: "009",
};
