import { arielDeterminedMermaid as ogArielDeterminedMermaid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/174-ariel-determined-mermaid";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielDeterminedMermaid: LorcanitoCharacterCardDefinition = {
  ...ogArielDeterminedMermaid,
  id: "b8l",
  reprints: [ogArielDeterminedMermaid.id],
  number: 196,
  set: "009",
};
