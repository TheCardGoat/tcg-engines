import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/caress-of-the-reaper.generated.ts";

export const caressOfTheReaper = definePitchFamily(fabPitchFamilies["caress-of-the-reaper"], {
  abilities: () => ({
    wheneverDealsDamageHeroDestroyTargetAuraTheyControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "on-stack",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});
export const { red: caressOfTheReaperRed } = caressOfTheReaper.cards;
