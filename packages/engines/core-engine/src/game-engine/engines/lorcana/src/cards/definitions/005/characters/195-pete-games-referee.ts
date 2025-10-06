import {
  opponentCantPlayActions,
  untilTheEndOfYourNextTurn,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteGamesReferee: LorcanaCharacterCardDefinition = {
  id: "kxp",
  name: "Pete",
  title: "Games Referee",
  characteristics: ["dreamborn", "villain"],
  text: "**BLOW THE WHISTLE** When you play this character, opponents can’t play actions until the start of your next turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Blow The Whistle",
      text: "When you play this character, opponents can’t play actions until the start of your next turn.",
      effects: [untilTheEndOfYourNextTurn(opponentCantPlayActions)],
    },
  ],
  flavour: "It ain't cheatin' if you're the one makin' the rules.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Luis Huerta",
  number: 195,
  set: "SSK",
  rarity: "uncommon",
};
