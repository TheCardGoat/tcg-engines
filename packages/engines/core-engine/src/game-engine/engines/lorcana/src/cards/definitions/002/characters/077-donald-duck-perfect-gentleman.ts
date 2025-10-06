import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import {
  opponent,
  self,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckPerfectGentleman: LorcanaCharacterCardDefinition = {
  id: "pgk",
  reprints: ["g8a"],
  name: "Donald Duck",
  title: "Perfect Gentleman",
  characteristics: ["floodborn", "ally"],
  text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Donald Duck._)\n**ALLOW ME** At the start of your turn, each player may draw a card.",
  type: "character",
  abilities: [
    shiftAbility(3, "donald duck"),
    atTheStartOfYourTurn({
      name: "OWNER PLAYER Allow Me",
      text: "At the start of your turn, each player may draw a card.",
      effects: [
        {
          type: "create-layer-for-player",
          target: opponent,
          layer: {
            type: "resolution",
            name: "OPPO PLAYER Allow Me",
            text: "At the start of your turn, each player may draw a card.",
            optional: true,
            responder: "opponent",
            effects: [drawACard],
          },
        },
        {
          type: "create-layer-for-player",
          target: self,
          layer: {
            type: "resolution",
            responder: "self",
            name: "OWNER PLAYER Allow Me",
            text: "You may draw a card.",
            optional: true,
            effects: [drawACard],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  illustrator: "Ron Baird",
  number: 77,
  set: "ROF",
  rarity: "uncommon",
};
