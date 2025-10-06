import { moanaOfMotunui as ogMoanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/014-moana-of-motunui";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaOfMotunui: LorcanitoCharacterCardDefinition = {
  ...ogMoanaOfMotunui,
  id: "c9q",
  reprints: [ogMoanaOfMotunui.id],
  number: 20,
  set: "009",
};
