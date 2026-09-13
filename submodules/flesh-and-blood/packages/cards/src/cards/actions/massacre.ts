import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/massacre.generated.ts";

export const massacre = definePitchFamily(fabPitchFamilies["massacre"], {
  abilities: () => ({
    attackMassacreDiscarded6MorePowerTurnMassacreGains2PowerIntimidate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
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
              name: "Massacre",
            },
          },
        },
        state: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
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
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "intimidate",
              target: "opponent",
            },
          ],
        },
      },
      label: {
        name: "intimidate",
      },
    },
    discardedPayCostBruteAttackActionIntimidate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "discarded-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "discarded-to-pay-cost-of-brute-attack-action-card",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "opponent",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: massacreRed } = massacre.cards;
