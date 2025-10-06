import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarRoyalVizier: LorcanaCharacterCardDefinition = {
  id: "fk0",
  reprints: ["xva"],
  name: "Jafar",
  title: "Royal Vizier",
  characteristics: ["sorcerer", "storyborn", "villain"],
  text: "**I DON'T TRUST HIM, SIRE** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    duringYourTurnGains(
      "I don't trust him, sire",
      "During your turn, this character gains **Evasive**.",
      evasiveAbility,
    ),
  ],
  flavour: "Soon you’ll learn who holds the real power!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Rob Di Salvo",
  number: 184,
  set: "ROF",
  rarity: "common",
};
