import { peterPansShadowNotSewnOn as ogPeterPansShadowNotSewnOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/055-peter-pans-shadow-not-sewn-on";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPansShadowNotSewnOn: LorcanitoCharacterCardDefinition = {
  ...ogPeterPansShadowNotSewnOn,
  id: "bt3",
  reprints: [ogPeterPansShadowNotSewnOn.id],
  number: 42,
  set: "009",
};
