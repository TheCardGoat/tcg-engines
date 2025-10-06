import { mulanFreeSpirit as ogMulanFreeSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/015-mulan-free-spirit";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanFreeSpirit: LorcanaCharacterCardDefinition = {
  ...ogMulanFreeSpirit,
  id: "efk",
  reprints: [ogMulanFreeSpirit.id],
  number: 10,
  set: "009",
};
