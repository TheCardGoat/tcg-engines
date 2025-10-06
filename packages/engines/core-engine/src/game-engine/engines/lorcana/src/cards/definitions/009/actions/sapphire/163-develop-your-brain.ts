import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { developYourBrain as ogDevelopYourBrain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/161-develop-your-brain";

export const developYourBrain: LorcanaActionCardDefinition = {
  ...ogDevelopYourBrain,
  id: "ph9",
  reprints: [ogDevelopYourBrain.id],
  number: 163,
  set: "009",
};
