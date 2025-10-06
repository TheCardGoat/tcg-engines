import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { underTheSea as ogUnderTheSea } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/095-under-the-sea";

export const underTheSea: LorcanaActionCardDefinition = {
  ...ogUnderTheSea,
  id: "wlg",
  reprints: [ogUnderTheSea.id],
  number: 97,
  set: "009",
};
