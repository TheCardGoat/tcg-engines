import { winnieThePoohHavingAThink as winnieThePoohHavingAThinkAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/161-winnie-the-pooh-having-a-think";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const winnieThePoohHavingAThink: LorcanaCharacterCardDefinition = {
  ...winnieThePoohHavingAThinkAsOrig,
  id: "vvd",
  reprints: [winnieThePoohHavingAThinkAsOrig.id],
  number: 159,
  set: "009",
};
