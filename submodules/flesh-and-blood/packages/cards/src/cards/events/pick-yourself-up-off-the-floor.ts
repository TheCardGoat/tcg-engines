import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/pick-yourself-up-off-the-floor.generated.ts";

export const pickYourselfUpOffTheFloor = defineCard(
  fabCardIdentitiesByCanonicalId.B9jHdDTw8qwQW7DnqdQPn,
  {
    abilities: {
      recoverAttackAction: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: attackActionFilter(),
                count: 1,
              },
              to: {
                zone: "deck",
                position: "top",
              },
              outputBinding: "it",
            },
            {
              type: "self-replacement",
              condition: {
                type: "life-comparison",
                player: "self",
                vs: "opponent",
                op: "lt",
              },
              modification: {
                type: "move-card",
                target: {
                  selector: "self",
                },
                to: {
                  zone: "hand",
                },
              },
            },
          ],
        },
      },
    },
  },
);
