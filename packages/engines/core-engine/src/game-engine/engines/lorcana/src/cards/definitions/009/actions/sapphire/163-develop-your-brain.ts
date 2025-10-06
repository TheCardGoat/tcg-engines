import { developYourBrain as ogDevelopYourBrain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions/161-develop-your-brain";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const developYourBrain: LorcanaActionCardDefinition = {
  ...ogDevelopYourBrain,
  id: "ph9",
  reprints: [ogDevelopYourBrain.id],
  number: 163,
  set: "009",
};
