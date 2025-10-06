import { motunuiIslandParadise as ogMotunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/170-motunui-island-paradise";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motunuiIslandParadise: LorcanaLocationCardDefinition = {
  ...ogMotunuiIslandParadise,
  id: "jiu",
  reprints: [ogMotunuiIslandParadise.id],
  number: 170,
  set: "009",
};
