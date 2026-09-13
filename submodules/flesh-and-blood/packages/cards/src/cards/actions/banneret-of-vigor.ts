import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/banneret-of-vigor.generated.ts";

export const banneretOfVigor = definePitchFamily(fabPitchFamilies["banneret-of-vigor"], {
  abilities: () => ({
    whenIsChargedHeroSSoulNextTimeHit: {
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
            kind: "source",
            selector: "moved-object",
          },
          to: "soul",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "hit",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "event-object",
                selector: "attack",
                relationship: {
                  kind: "controller",
                  player: "ability-controller",
                },
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "gain-resources",
              amount: 1,
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
export const { yellow: banneretOfVigorYellow } = banneretOfVigor.cards;
