import { mickeyMouseSteamBoatPilot as mickeyMouseSteamboatPilotAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/089-mickey-mouse-steamboat-pilot";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseSteamboatPilot: LorcanaCharacterCardDefinition = {
  ...mickeyMouseSteamboatPilotAsOrig,
  id: "y3c",
  reprints: [mickeyMouseSteamboatPilotAsOrig.id],
  number: 80,
  set: "009",
};
