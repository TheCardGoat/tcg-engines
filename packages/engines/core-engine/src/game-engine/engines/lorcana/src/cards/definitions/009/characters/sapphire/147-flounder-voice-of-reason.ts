import { flounderVoiceOfReason as flounderVoiceOfReasonAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flounderVoiceOfReason: LorcanaCharacterCardDefinition = {
  ...flounderVoiceOfReasonAsOrig,
  id: "yyq",
  reprints: [flounderVoiceOfReasonAsOrig.id],
  number: 147,
  set: "009",
};
