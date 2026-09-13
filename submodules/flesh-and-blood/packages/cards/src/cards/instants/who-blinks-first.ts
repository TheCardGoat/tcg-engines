import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/who-blinks-first.generated.ts";

export const whoBlinksFirst = definePitchFamily(fabPitchFamilies["who-blinks-first"], {
  keywords: [suspense],
  abilities: () => ({
    whenLeavesArenaMayDestroyAuraPermanentGuardianHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                hasStatus: "controlled-by-a-guardian-hero",
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { blue: whoBlinksFirstBlue } = whoBlinksFirst.cards;
