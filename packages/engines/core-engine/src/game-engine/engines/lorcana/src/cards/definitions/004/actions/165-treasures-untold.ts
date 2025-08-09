import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { upToTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const treasuresUntold: LorcanaActionCardDefinition = {
  id: "pzn",
  name: "Treasures Untold",
  characteristics: ["action", "song"],
  text: "Return up to 2 item cards from your discard into your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return up to 2 item cards from your discard into your hand.",
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
          targets: upToTarget({
            target: {
              type: "card",
              cardType: "item",
              zone: "discard",
              count: 1,
            },
            upTo: 2,
          }),
        }),
      ],
    },
  ],
  flavour: "How many wonders can one cavern hold?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Matt Gaser",
  number: 165,
  set: "URR",
  rarity: "rare",
};
