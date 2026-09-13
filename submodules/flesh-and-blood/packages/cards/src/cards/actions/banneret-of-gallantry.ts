import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-gallantry.generated.ts";

export const banneretOfGallantry = definePitchFamily(fabPitchFamilies["banneret-of-gallantry"], {
  abilities: () => ({
    whenIsChargedHeroSSoulCreateQuickenToken: {
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
          token: "quicken",
          controller: "controller",
        },
      },
      label: {
        name: "solflare",
      },
    },
  }),
});
export const { yellow: banneretOfGallantryYellow } = banneretOfGallantry.cards;
