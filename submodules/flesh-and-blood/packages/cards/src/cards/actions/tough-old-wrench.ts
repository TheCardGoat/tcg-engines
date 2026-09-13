import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tough-old-wrench.generated.ts";

export const toughOldWrench = definePitchFamily(fabPitchFamilies["tough-old-wrench"], {
  abilities: () => ({
    triggeredStaticOnDefendEffect: {
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
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
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
      label: {
        name: "galvanize",
      },
    },
  }),
});

export const {
  red: toughOldWrenchRed,
  yellow: toughOldWrenchYellow,
  blue: toughOldWrenchBlue,
} = toughOldWrench.cards;
