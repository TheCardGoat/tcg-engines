import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/turn-heads.generated.ts";

export const turnHeads = definePitchFamily(fabPitchFamilies["turn-heads"], {
  keywords: [suspense],
  abilities: () => ({
    whenLeavesArenaTargetBruteHeroTheyDonT: {
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
          type: "sequence",
          steps: [
            {
              type: "tap",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["hero"],
                filter: {
                  typeBox: {
                    supertypes: ["Brute"],
                    types: ["Hero"],
                  },
                },
                count: 1,
              },
              outputBinding: "tapped-hero",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "untap",
              subject: {
                selector: "binding",
                binding: "tapped-hero",
              },
              duration: "until-end-of-next-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: turnHeadsBlue } = turnHeads.cards;
