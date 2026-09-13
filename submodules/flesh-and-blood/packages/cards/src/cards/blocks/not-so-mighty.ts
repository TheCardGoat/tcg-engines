import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/not-so-mighty.generated.ts";

export const notSoMighty = definePitchFamily(fabPitchFamilies["not-so-mighty"], {
  abilities: () => ({
    destroyMightCreateToughness: {
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
                supertypes: ["Reviled"],
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
                name: "Might",
              },
              count: 1,
            },
          },
          then: {
            type: "create-token",
            token: "toughness",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { blue: notSoMightyBlue } = notSoMighty.cards;
