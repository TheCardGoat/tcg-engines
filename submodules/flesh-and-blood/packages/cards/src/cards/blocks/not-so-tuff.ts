import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/not-so-tuff.generated.ts";

export const notSoTuff = definePitchFamily(fabPitchFamilies["not-so-tuff"], {
  abilities: () => ({
    destroyToughnessCreateMight: {
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
                supertypes: ["Revered"],
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
          type: "if-you-do",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                name: "Toughness",
              },
              count: 1,
            },
          },
          then: {
            type: "create-token",
            token: "might",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: notSoTuffBlue } = notSoTuff.cards;
