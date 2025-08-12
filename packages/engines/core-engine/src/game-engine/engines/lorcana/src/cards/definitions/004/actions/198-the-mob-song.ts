import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import {
  chosenCharacterOrLocationTarget,
  upToTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theMobSong: LorcanaActionCardDefinition = {
  id: "h6n",
  name: "The Mob Song",
  characteristics: ["action", "song"],
  text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
  type: "action",
  abilities: [
    singerTogetherAbility(10),
    {
      type: "static",
      text: "Deal 3 damage to up to 3 chosen characters and/or locations.",
      effects: [
        dealDamageEffect({
          value: 3,
          targets: upToTarget({
            target: chosenCharacterOrLocationTarget,
            upTo: 3,
          }),
        }),
      ],
    },
  ],
  colors: ["steel"],
  cost: 10,
  illustrator: "Ian MacDonald",
  number: 198,
  set: "URR",
  rarity: "uncommon",
};
