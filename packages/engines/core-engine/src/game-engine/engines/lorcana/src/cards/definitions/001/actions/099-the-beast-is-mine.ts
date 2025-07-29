import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theBeastIsMine: LorcanaActionCardDefinition = {
  id: "mlb",
  name: "The Beast is Mine!",
  characteristics: ["action"],
  text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "The Beast is Mine!",
      text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour:
    "It's only fitting that the finest hunter gets the foulest \rbeast!<br />\r− Gaston",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "\tMatthew Robert Davies",
  number: 99,
  set: "TFC",
  rarity: "uncommon",
};
