import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/steel-street-hoons.generated.ts";
import { boost } from "../shared/keywords.ts";

export const steelStreetHoons = definePitchFamily(fabPitchFamilies["steel-street-hoons"], {
  keywords: [boost],
  abilities: () => ({
    itemControlHasDestroyedTurnGetsNumber2Power: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "destroy-item",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    whenDefendsDestroyItemControlDoGetsNumber2Defense: {
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
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
      label: {
        name: "galvanize",
      },
    },
  }),
});

export const { blue: steelStreetHoonsBlue } = steelStreetHoons.cards;
