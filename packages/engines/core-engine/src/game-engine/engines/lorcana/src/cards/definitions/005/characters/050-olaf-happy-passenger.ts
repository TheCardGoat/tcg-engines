import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olafHappyPassenger: LorcanaCharacterCardDefinition = {
  id: "j4c",
  name: "Olaf",
  title: "Happy Passenger",
  characteristics: ["storyborn", "ally"],
  text: "**CLEAR THE PATH** For each exerted character opponents have in play, you pay 1 {I} less to play this character.<br/>**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [
    evasiveAbility,
    whenYouPlayThisForEachYouPayLess({
      name: "**CLEAR THE PATH**",
      text: "For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
      amount: {
        dynamic: true,
        filters: [
          { filter: "owner", value: "opponent" },
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
          { filter: "status", value: "exerted" },
        ],
      },
    }),
  ],
  colors: ["amethyst"],
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  illustrator: "Andrea Parisi",
  number: 50,
  set: "SSK",
  rarity: "rare",
};
