import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crown-of-reflection.generated.ts";

export const crownOfReflection = defineCard(
  fabCardIdentitiesByCanonicalId["MkjQ7zw7Bpc8BMJDnJ9fC"],
  {
    keywords: [arcaneBarrier(1)],
    abilities: {
      instantDestroyCrownReflectionDestroyTargetIllusionistAuraControl: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        condition: {
          type: "has-status",
          status: "during-your-action-phase",
        },
        // "If you do" gates the put-from-hand on successful destroy. Cost filter
        // must read the destroyed aura's cost (reference binding), not count of
        // destroyed objects (destroyed-this-way).
        effect: {
          type: "if-you-do",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  supertypes: ["Illusionist"],
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  typeBox: {
                    supertypes: ["Illusionist"],
                    subtypes: ["Aura"],
                  },
                  cost: {
                    op: "lte",
                    value: {
                      type: "reference",
                      binding: "it",
                      property: "cost",
                      missing: "zero",
                    },
                  },
                },
                count: 1,
              },
              to: {
                zone: "permanent",
              },
            },
          },
        },
      },
    },
  },
);
