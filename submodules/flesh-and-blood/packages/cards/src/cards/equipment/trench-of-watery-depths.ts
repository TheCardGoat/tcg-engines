import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/trench-of-watery-depths.generated.ts";

export const trenchOfWateryDepths = defineCard(
  fabCardIdentitiesByCanonicalId["wr9jWmbRhHJ7th99rbPGd"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenDefendsMayPitchBlueFromGraveyard: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            // Real pitch (CR 8.5.44): GY → pitch zone + generate pitch resources
            // (blue → 3{r}). Not bare move-card (no resources).
            // color:["blue"] — not types:["Blue"] residue (SEA179 sibling).
            effect: {
              type: "pitch-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  color: ["blue"],
                },
                count: 1,
              },
            },
          },
        },
      },
    },
  },
);
