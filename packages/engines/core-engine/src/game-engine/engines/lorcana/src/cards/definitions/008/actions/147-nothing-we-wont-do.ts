import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  damageImmunityEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nothingWeWontDo: LorcanaActionCardDefinition = {
  id: "pm2",
  name: "Nothing We Won't Do",
  characteristics: ["action", "song"],
  text: "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
  type: "action",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "static",
      text: "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
      targets: [yourCharactersTarget],
      effects: [
        { type: "ready", targets: [yourCharactersTarget] },
        restrictEffect({
          targets: [yourCharactersTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        damageImmunityEffect({
          targets: [yourCharactersTarget],
          sources: ["challenges"],
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  illustrator: "Jeanne Plattenet",
  number: 147,
  set: "008",
  rarity: "rare",
};
