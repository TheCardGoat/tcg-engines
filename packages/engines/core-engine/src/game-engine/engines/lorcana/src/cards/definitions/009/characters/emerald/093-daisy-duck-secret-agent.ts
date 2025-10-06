import { daisyDuckSecretAgent as daisyDuckSecretAgentAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/076-daisy-duck-secret-agent";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckSecretAgent: LorcanaCharacterCardDefinition = {
  ...daisyDuckSecretAgentAsOrig,
  id: "pqa",
  reprints: [daisyDuckSecretAgentAsOrig.id],
  number: 93,
  set: "009",
};
