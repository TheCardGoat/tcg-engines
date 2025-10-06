import { ursulaShellNecklace as ogUrsulaShellNecklace } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/034-ursula-shell-necklace";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulasShellNecklace: LorcanaItemCardDefinition = {
  ...ogUrsulaShellNecklace,
  id: "nm0",
  reprints: [ogUrsulaShellNecklace.id],
  number: 33,
  set: "009",
};
