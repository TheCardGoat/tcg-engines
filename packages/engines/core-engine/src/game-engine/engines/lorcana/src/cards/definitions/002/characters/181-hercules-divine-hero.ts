import {
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesDivineHero: LorcanitoCharacterCardDefinition = {
  id: "e0i",
  name: "Hercules",
  title: "Divine Hero",
  characteristics: ["hero", "floodborn", "deity", "prince"],
  text: "**Shift** 4 _You may pay 4 {I} to play this on top of one of your characters named Hercules.)_\n\n**Resist** +2 _(Damage dealt to this character is reduced by 2.)_",
  type: "character",
  abilities: [shiftAbility(4, "hercules"), resistAbility(2)],
  flavour: "A good guy to have around when something wrecks your inkworks.",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  illustrator: "Grace Tran",
  number: 181,
  set: "ROF",
  rarity: "rare",
};
