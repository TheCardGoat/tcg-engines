import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ratchet-up.generated.ts";

export const ratchetUp = definePitchFamily(fabPitchFamilies["ratchet-up"], {
  abilities: () => ({
    whileAndPerformedThisTurnDestroyItemHasStatusAttackingModifyNumericDefenseAllThisChainLink: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "and",
        conditions: [
          {
            type: "performed-this-turn",
            event: "destroy-item",
            player: "controller",
          },
          {
            type: "has-status",
            status: "attacking",
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "this-chain-link",
      },
    },
    triggeredDefendOptionalDestroyModifyNumericDefenseThisTurnGalvanize: {
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

export const { red: ratchetUpRed, yellow: ratchetUpYellow, blue: ratchetUpBlue } = ratchetUp.cards;
