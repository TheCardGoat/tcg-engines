import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-the-dawnsmith.generated.ts";

export const visitTheDawnsmith = definePitchFamily(fabPitchFamilies["visit-the-dawnsmith"], {
  keywords: [
    {
      name: "sharpen",
    },
  ],
  abilities: () => ({
    atStartTurnDestroySharpenAllSwordsControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "sharpen",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["weapon", "permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Sword"],
                  },
                },
                count: {
                  type: "all",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: visitTheDawnsmithBlue } = visitTheDawnsmith.cards;
