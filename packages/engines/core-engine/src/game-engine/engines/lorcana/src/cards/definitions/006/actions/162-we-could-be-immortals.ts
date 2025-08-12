import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  gainsAbilityEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { sourceCardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weCouldBeImmortals: LorcanaActionCardDefinition = {
  id: "nb5",
  name: "We Could Be Immortals",
  characteristics: ["action", "song"],
  text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
      targets: [
        {
          type: "card",
          cardType: "character",
          owner: "self",
          withClassification: "inventor",
        },
      ],
      effects: [
        gainsAbilityEffect({
          targets: [
            {
              type: "card",
              cardType: "character",
              owner: "self",
              withClassification: "inventor",
            },
          ],
          ability: resistAbility(6),
          duration: THIS_TURN,
        }),
        putCardEffect({
          to: "inkwell",
          from: "play",
          targets: [sourceCardTarget],
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  lore: 6,
  illustrator: "Ian MacDonald",
  number: 162,
  set: "006",
  rarity: "rare",
};
