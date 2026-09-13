import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/down-but-not-out.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const downButNotOut = definePitchFamily(fabPitchFamilies["down-but-not-out"], {
  abilities: () => ({
    underdog: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
        state: {
          type: "and",
          conditions: [
            { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
            {
              type: "compare-amount",
              amount: {
                type: "sum",
                operands: [
                  { type: "count", what: "equipped-objects", player: "controller" },
                  {
                    type: "count",
                    what: "cards-in-zone",
                    zone: "permanent",
                    player: "controller",
                    filter: { typeBox: { types: ["Token"] } },
                  },
                ],
              },
              comparison: {
                op: "lt",
                value: {
                  type: "sum",
                  operands: [
                    { type: "count", what: "equipped-objects", player: "opponent" },
                    {
                      type: "count",
                      what: "cards-in-zone",
                      zone: "permanent",
                      player: "opponent",
                      filter: { typeBox: { types: ["Token"] } },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: { selector: "self" },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: { kind: "keyword", keyword: overpower },
              target: { selector: "self" },
              duration: "permanent",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "createTokensOnHit",
                  text: "",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "hit",
                      actor: { kind: "player", player: "ability-controller" },
                      observes: { kind: "source", selector: "attack" },
                    },
                  },
                  resolution: {
                    kind: "effect",
                    effect: {
                      type: "sequence",
                      steps: [
                        { type: "create-token", token: "agility", controller: "controller" },
                        { type: "create-token", token: "might", controller: "controller" },
                        { type: "create-token", token: "vigor", controller: "controller" },
                      ],
                    },
                  },
                },
              },
              target: { selector: "self" },
              duration: "permanent",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: downButNotOutRed,
  yellow: downButNotOutYellow,
  blue: downButNotOutBlue,
} = downButNotOut.cards;
