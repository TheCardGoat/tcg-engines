import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soup-up.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const soupUp = definePitchFamily(fabPitchFamilies["soup-up"], {
  abilities: () => ({
    resolutionGrantProperty: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "destroy-item",
        player: "controller",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
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

export const { red: soupUpRed, yellow: soupUpYellow, blue: soupUpBlue } = soupUp.cards;
