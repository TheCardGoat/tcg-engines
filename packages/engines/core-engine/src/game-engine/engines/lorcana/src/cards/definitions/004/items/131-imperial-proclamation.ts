import { youPayXLessToPlayNextCharThisTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imperialProclamation: LorcanaItemCardDefinition = {
  id: "vlv",
  name: "Imperial Proclamation",
  characteristics: ["item"],
  text: "**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
  type: "item",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherChar({
      name: "Call To The Front",
      text: "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(1)],
    }),
  ],
  flavour:
    "By order of the Emperor, one man from every family must server in the Imperial Army\n−Chi Fu",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Devin Yang",
  number: 131,
  set: "URR",
  rarity: "rare",
};
