import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stormweaver-s-aegis.generated.ts";

export const stormweaverSAegis = defineCard(
  fabCardIdentitiesByCanonicalId["jGpmP7RtNPqn6WnmJkLwQ"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      instantDestroyUntilEndTurnInstantOwnGetInstant: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              id: "instantDiscardPreventNext2DamageWouldBeDealt",
              text: "",
              kind: "activated",
              abilityType: "instant",
              cost: {
                class: "effect",
                type: "discard-self",
              },
              effect: {
                type: "prevention",
                preventionKind: "fixed",
                amount: 2,
                shielded: {
                  selector: "controller",
                },
                duration: "this-turn",
              },
            },
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand", "deck", "graveyard", "banished", "arsenal", "pitch"],
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
    },
  },
);
