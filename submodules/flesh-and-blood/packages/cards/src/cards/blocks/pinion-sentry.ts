import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/pinion-sentry.generated.ts";

export const pinionSentry = definePitchFamily(fabPitchFamilies["pinion-sentry"], {
  abilities: () => ({
    tapCogCreateGoldenCog: {
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
          effect: {
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Cog"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "create-token",
            token: "golden-cog",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: pinionSentryBlue } = pinionSentry.cards;
