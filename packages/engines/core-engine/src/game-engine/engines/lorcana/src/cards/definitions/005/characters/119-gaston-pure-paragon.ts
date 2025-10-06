import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonPureParagon: LorcanitoCharacterCardDefinition = {
  id: "pzz",
  name: "Gaston",
  title: "Pure Paragon",
  characteristics: ["dreamborn", "villain"],
  text: "**A MAN AMONG MEN!** For each damaged character you have in play, you pay 2 {I} less to play this character.<br/>**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [
    rushAbility,
    whenYouPlayThisForEachYouPayLess({
      name: "A Man among men",
      text: "For each damaged character you have in play, you pay 2 {I} less to play this character.",
      amount: {
        dynamic: true,
        filterMultiplier: 2,
        filters: [
          { filter: "owner", value: "self" },
          { filter: "status", value: "damaged" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 9,
  strength: 10,
  willpower: 6,
  lore: 2,
  illustrator: "Dave Alvarez / Livio Ramondelli",
  number: 119,
  set: "SSK",
  rarity: "rare",
};
