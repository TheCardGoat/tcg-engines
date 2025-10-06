import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { ursulaShellNecklace as ogUrsulaShellNecklace } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/034-ursula-shell-necklace";

export const ursulasShellNecklace: LorcanaItemCardDefinition = {
  ...ogUrsulaShellNecklace,
  id: "nm0",
  reprints: [ogUrsulaShellNecklace.id],
  number: 33,
  set: "009",
};
