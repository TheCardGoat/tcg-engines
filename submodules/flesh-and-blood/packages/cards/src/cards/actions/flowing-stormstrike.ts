import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flowing-stormstrike.generated.ts";

export const flowingStormstrike = definePitchFamily(fabPitchFamilies["flowing-stormstrike"], {
  abilities: () => ({
    twicePerTurnInstantGets1: {
      kind: "activated",
      limit: {
        count: 2,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
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
    whenHitsCreateLightningFlowToken: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "lightning-flow",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: flowingStormstrikeRed } = flowingStormstrike.cards;
