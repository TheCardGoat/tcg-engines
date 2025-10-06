import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { theMobSong as ogTheMobSong } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/198-the-mob-song";

export const theMobSong: LorcanaActionCardDefinition = {
  ...ogTheMobSong,
  id: "fj5",
  reprints: [ogTheMobSong.id],
  number: 202,
  set: "009",
};
