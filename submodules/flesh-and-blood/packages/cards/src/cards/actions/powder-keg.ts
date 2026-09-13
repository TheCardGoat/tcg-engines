import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/powder-keg.generated.ts";

export const powderKeg = definePitchFamily(fabPitchFamilies["powder-keg"], {
  abilities: () => ({
    wheneverMechanologistGunHitsDestroyPowderKegDefendingEquipment: {
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
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Mechanologist"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Gun"],
                  },
                },
              ],
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "any",
                  zones: ["combat-chain"],
                  filter: {
                    typeBox: {
                      types: ["Equipment"],
                    },
                    defending: true,
                  },
                  count: 1,
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { blue: powderKegBlue } = powderKeg.cards;
