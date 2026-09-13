import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-resilience.generated.ts";

export const banneretOfResilience = definePitchFamily(fabPitchFamilies["banneret-of-resilience"], {
  abilities: () => ({
    whenIsChargedHeroSSoulNextActionDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            bindAs: "it",
          },
          to: "soul",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
              },
              defending: true,
            },
          },
        },
      },
      label: {
        name: "solflare",
      },
    },
  }),
});
export const { yellow: banneretOfResilienceYellow } = banneretOfResilience.cards;
