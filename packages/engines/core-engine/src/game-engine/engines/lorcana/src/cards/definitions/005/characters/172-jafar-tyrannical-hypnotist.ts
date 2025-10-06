import {
  challengerAbility,
  charactersWithCostXorLessCantChallenge,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarTyrannicalHypnotist: LorcanaCharacterCardDefinition = {
  id: "c2a",
  name: "Jafar",
  title: "Tyrannical Hypnotist",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  text: "**Challenger** +7 _(While challenging, this character gets +7 {S}.)_\n \n**INTIMIDATING GAZE** Opposing characters with cost 4 or less can’t challenge.",
  type: "character",
  abilities: [
    challengerAbility(7),
    charactersWithCostXorLessCantChallenge({
      name: "Intimidating Gaze",
      text: "Opposing characters with cost 4 or less can’t challenge.",
      cost: 4,
    }),
  ],
  flavour: "No one will keep me from the broken crown!",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 0,
  willpower: 7,
  lore: 2,
  illustrator: "Cam Kendell",
  number: 172,
  set: "SSK",
  rarity: "legendary",
};
