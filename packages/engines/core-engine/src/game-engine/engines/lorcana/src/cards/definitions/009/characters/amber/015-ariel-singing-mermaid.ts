import { arielSingingMermaid as ogArielSingingMermaid } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/003-ariel-singing-mermaid";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielSingingMermaid: LorcanitoCharacterCardDefinition = {
  ...ogArielSingingMermaid,
  id: "vqa",
  reprints: [ogArielSingingMermaid.id],
  number: 15,
  set: "009",
};
