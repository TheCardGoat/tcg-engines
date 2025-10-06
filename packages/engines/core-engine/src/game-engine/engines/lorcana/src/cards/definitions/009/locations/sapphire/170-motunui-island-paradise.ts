import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { motunuiIslandParadise as ogMotunuiIslandParadise } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/170-motunui-island-paradise";

export const motunuiIslandParadise: LorcanaLocationCardDefinition = {
  ...ogMotunuiIslandParadise,
  id: "jiu",
  reprints: [ogMotunuiIslandParadise.id],
  number: 170,
  set: "009",
};
