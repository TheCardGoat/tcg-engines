import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cogwerx-zeppelin.generated.ts";

export const cogwerxZeppelin = definePitchFamily(fabPitchFamilies["cogwerx-zeppelin"], {
  abilities: () => ({
    onHitTapCreateTokenGoldenCog: {
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
          type: "optional",
          effect: {
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Cog"],
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
    },
    tapModifyNumericPowerActivation: {
      kind: "activated",
      limit: {
        count: 2,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap",
        filter: {
          typeBox: {
            subtypes: ["Cog"],
          },
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: cogwerxZeppelinRed,
  yellow: cogwerxZeppelinYellow,
  blue: cogwerxZeppelinBlue,
} = cogwerxZeppelin.cards;
