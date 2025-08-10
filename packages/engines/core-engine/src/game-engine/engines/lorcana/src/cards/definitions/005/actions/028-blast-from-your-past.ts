import {
  nameCardEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const blastFromYourPast: LorcanaActionCardDefinition = {
  id: "zt6",
  name: "Blast From Your Past",
  characteristics: ["action", "song"],
  text: "_(A character with cost 6 or more can {E} to sing this song for free.)_\nName a card. Return all character cards with that name from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Name a card. Return all character cards with that name from your discard to your hand.",
      effects: [
        nameCardEffect({
          targets: [selfPlayerTarget],
          followedBy: putCardEffect({
            to: "hand",
            from: "discard",
            targets: [
              {
                type: "card",
                zone: "discard",
                owner: "self",
                cardType: "character",
                withNamedCard: true,
                count: -1, // All matching cards
              },
            ],
          }),
        }),
      ],
    },
  ],
  colors: ["amber"],
  cost: 6,
  illustrator: "Nicola Saviori",
  number: 28,
  set: "SSK",
  rarity: "super_rare",
};
