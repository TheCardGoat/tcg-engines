import { playCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gruesomeAndGrim: LorcanaActionCardDefinition = {
  id: "zcv",
  name: "Gruesome And Grim",
  characteristics: ["action", "song"],
  text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them.",
  type: "action",
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 62,
  set: "ROF",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
      targets: [selfPlayerTarget],
      effects: [
        playCardEffect({
          from: "hand",
          cost: "free",
          filter: {
            cardType: "character",
            cost: { max: 4 },
          },
          gainsAbilities: [rushAbility],
          // TODO: Need end-of-turn banish trigger
        }),
      ],
    },
  ],
};
