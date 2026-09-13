import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runic-reclamation.generated.ts";

export const runicReclamation = definePitchFamily(fabPitchFamilies["runic-reclamation"], {
  abilities: () => ({
    runicReclamationHitsDestroyTargetAuraCreateRunechantToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
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
          then: {
            type: "create-token",
            token: "runechant",
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { red: runicReclamationRed } = runicReclamation.cards;
