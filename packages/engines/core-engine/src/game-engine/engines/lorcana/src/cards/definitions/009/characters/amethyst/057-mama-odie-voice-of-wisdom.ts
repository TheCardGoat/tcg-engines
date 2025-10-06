import { mamaOdieVoiceOfWisdom as mamaOdieVoiceOfWisdomAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/052-mama-odie-voice-of-wisdom";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mamaOdieVoiceOfWisdom: LorcanitoCharacterCardDefinition = {
  ...mamaOdieVoiceOfWisdomAsOrig,
  id: "ozw",
  reprints: [mamaOdieVoiceOfWisdomAsOrig.id],
  number: 57,
  set: "009",
};
