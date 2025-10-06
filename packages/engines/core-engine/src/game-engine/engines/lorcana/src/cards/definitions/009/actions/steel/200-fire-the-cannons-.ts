import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { fireTheCannons as ogFireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/197-fire-the-cannons";

export const fireTheCannons: LorcanaActionCardDefinition = {
  ...ogFireTheCannons,
  id: "ooh",
  reprints: [ogFireTheCannons.id],
  number: 200,
  set: "009",
};
