import { fireTheCannons as ogFireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/197-fire-the-cannons";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fireTheCannons: LorcanaActionCardDefinition = {
  ...ogFireTheCannons,
  id: "ooh",
  reprints: [ogFireTheCannons.id],
  number: 200,
  set: "009",
};
