import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-courage.generated.ts";

export const banneretOfCourage = definePitchFamily(fabPitchFamilies["banneret-of-courage"], {
  abilities: () => ({
    whenIsChargedHeroSSoulCreateCourageToken: {
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
          type: "create-token",
          token: "courage",
          controller: "controller",
        },
      },
      label: {
        name: "solflare",
      },
    },
  }),
});
export const { yellow: banneretOfCourageYellow } = banneretOfCourage.cards;
