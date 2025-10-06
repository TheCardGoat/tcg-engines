import { underTheSea as ogUnderTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/095-under-the-sea";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const underTheSea: LorcanaActionCardDefinition = {
  ...ogUnderTheSea,
  id: "wlg",
  reprints: [ogUnderTheSea.id],
  number: 97,
  set: "009",
};
