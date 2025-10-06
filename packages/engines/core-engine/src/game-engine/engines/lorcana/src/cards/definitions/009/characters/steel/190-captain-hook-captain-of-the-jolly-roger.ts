import { captainHookCaptainOfTheJollyRoger as captainHookCaptainOfTheJollyRogerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookCaptainOfTheJollyRoger: LorcanitoCharacterCardDefinition =
  {
    ...captainHookCaptainOfTheJollyRogerAsOrig,
    id: "kc5",
    reprints: [captainHookCaptainOfTheJollyRogerAsOrig.id],
    number: 190,
    set: "009",
  };
