import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/barkskin-of-the-millennium-tree.generated.ts";

export const barkskinOfTheMillenniumTree = defineCard(
  fabCardIdentitiesByCanonicalId["qdDLqzd6FfmjfPGHLD6NW"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsIfThereAre4MoreEarthBanished: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
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
          state: {
            type: "zone-count",
            zone: "banished",
            player: "controller",
            filter: {
              typeBox: {
                supertypes: ["Earth"],
              },
            },
            comparison: {
              op: "gte",
              value: 4,
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "create-token",
            token: "embodiment-of-earth",
            controller: "controller",
          },
        },
      },
    },
  },
);
