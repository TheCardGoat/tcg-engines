import { drawCardsUntilYouHaveSameNumberOfCardsAsOpponent } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheEndOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const clarabelleLightOnHerHooves: LorcanaCharacterCardDefinition = {
  id: "xzi",
  name: "Clarabelle",
  title: "Light on Her Hooves",
  characteristics: ["floodborn", "ally"],
  text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Clarabelle.)_\n \n**KEEP IN STEP** At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
  type: "character",
  abilities: [
    shiftAbility(5, "Clarabelle"),
    atTheEndOfYourTurn({
      name: "**KEEP IN STEP**",
      text: "At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
      optional: true,
      conditions: [
        {
          type: "hand",
          amount: "lt",
          player: "self",
        },
      ],
      effects: [drawCardsUntilYouHaveSameNumberOfCardsAsOpponent],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  illustrator: "Jennifer Park / Livio Cacciatore",
  number: 84,
  set: "SSK",
  rarity: "legendary",
};
