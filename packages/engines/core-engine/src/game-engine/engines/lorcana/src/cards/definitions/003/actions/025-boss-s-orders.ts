import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bosssOrders: LorcanaActionCardDefinition = {
  id: "tqk",
  name: "Boss's Orders",
  characteristics: ["action"],
  text: "Chosen character gains **Support** this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Support this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: supportAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour:
    "Snoops! I know you can look harder! Find me that lore! \n−Madame Medusa",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Zuzana Sokolova / Livio Cacciatore",
  number: 25,
  set: "ITI",
  rarity: "common",
};
