import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/beacon-of-victory.generated.ts";

export const beaconOfVictory = definePitchFamily(fabPitchFamilies["beacon-of-victory"], {
  abilities: () => ({
    banishSoulAsCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: {
            type: "x",
          },
        },
      },
    },
    boostForBanishedSoul: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "x",
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    searchAfterCharge: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "charge", player: "controller" },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
              cost: { op: "lte", value: { type: "x" } },
            },
            mayFail: true,
            to: {
              zone: "hand",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { yellow: beaconOfVictoryYellow } = beaconOfVictory.cards;
