import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cap-of-quick-thinking.generated.ts";

export const capOfQuickThinking = defineCard(
  fabCardIdentitiesByCanonicalId["GkcwtGfWGcDBmQ7BbFNRt"],
  {
    abilities: {
      instantDestroyIfWouldBeDealtDamageBySource: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 1,
          shielded: {
            selector: "controller",
          },
          source: {
            selector: "opponent",
          },
          optionalCost: {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
          },
          additionalModification: {
            type: "draw",
            count: 1,
            player: "controller",
          },
          duration: "this-turn",
        },
      },
    },
  },
);
