import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/clash-of-mountains.generated.ts";

export const clashOfMountains = definePitchFamily(fabPitchFamilies["clash-of-mountains"], {
  abilities: () => ({
    onDefendClashCreateTokenSeismicSurge: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Guardian"],
              },
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "clash",
          with: {
            selector: "attacking-hero",
          },
          prize: {
            type: "create-token",
            token: "seismic-surge",
            creator: "token-controller",
            controller: "winner",
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});
export const {
  red: clashOfMountainsRed,
  yellow: clashOfMountainsYellow,
  blue: clashOfMountainsBlue,
} = clashOfMountains.cards;
