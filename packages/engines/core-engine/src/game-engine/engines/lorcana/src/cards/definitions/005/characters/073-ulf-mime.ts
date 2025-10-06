import { voicelessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/voicelessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ulfMime: LorcanaCharacterCardDefinition = {
  id: "hyz",
  name: "Ulf",
  title: "Mime",
  characteristics: ["ally"],
  text: "**SILENT PERFORMANCE** This character can't {E} to sing songs.",
  type: "character",
  abilities: [voicelessAbility],
  flavour: "His performances are unspeakably good.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "Matt Chapman",
  number: 73,
  set: "SSK",
  rarity: "common",
};
