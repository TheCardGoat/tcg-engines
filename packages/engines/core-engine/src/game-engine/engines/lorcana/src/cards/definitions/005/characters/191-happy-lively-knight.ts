import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const happyLivelyKnight: LorcanaCharacterCardDefinition = {
  id: "kw2",
  name: "Happy",
  title: "Lively Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    duringYourTurnGains(
      "BURST OF SPEED",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Mariana Moreno",
  number: 191,
  set: "SSK",
  rarity: "common",
};
