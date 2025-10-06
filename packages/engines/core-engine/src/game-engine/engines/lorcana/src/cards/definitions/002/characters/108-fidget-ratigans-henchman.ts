import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fidgetRatigansHenchman: LorcanitoCharacterCardDefinition = {
  id: "p8b",
  name: "Fidget",
  title: "Ratigan's Henchman",
  characteristics: ["dreamborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "When a normal henchman just won't cut it.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Giulia Riva",
  number: 108,
  set: "ROF",
  rarity: "common",
};
