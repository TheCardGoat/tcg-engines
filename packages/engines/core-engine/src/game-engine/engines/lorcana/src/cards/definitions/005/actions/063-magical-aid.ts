import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicalAid: LorcanaActionCardDefinition = {
  id: "sx8",
  name: "Magical Aid",
  characteristics: ["action"],
  text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: challengerAbility(3),
          duration: THIS_TURN,
        }),
        // TODO: Skipping implementation - requires complex triggered ability for "when banished in challenge" condition
        gainsAbilityEffect({ ability: challengerAbility(0) }),
      ],
    },
  ],
  flavour: "You’ve got some power in your corner now!\n— Genie",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Luca Pinelli",
  number: 63,
  set: "SSK",
  rarity: "uncommon",
};
