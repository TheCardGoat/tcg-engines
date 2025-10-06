import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zazuAdvisorToMufasa: LorcanaCharacterCardDefinition = {
  id: "g60",
  name: "Zazu",
  title: "Advisor to Mufasa",
  characteristics: ["storyborn", "ally"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character)._",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "Oh, I guess one quick spin through the lights won’t hurt.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Kuya Jaypi",
  number: 72,
  set: "SSK",
  rarity: "common",
};
