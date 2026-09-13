import { overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/moonshot.generated.ts";

export const moonshot = definePitchFamily(fabPitchFamilies["moonshot"], {
  abilities: () => ({
    playOnlyBoostedTurnAdditionalCostPlayDestroyXHyperDrivers: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      playEffect: {
        role: "condition",
      },
    },
    playOnlyBoostedTurnAdditionalCostPlayDestroyXHyperDriversPlayDestroyXHyperDriver: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "destroy",
          count: {
            type: "x",
          },
          filter: {
            name: "Hyper Driver",
          },
        },
      },
    },
    attacksGets3PowerHyperDriverDestroyedWay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "repeat",
          times: {
            type: "count",
            what: "destroyed-this-way",
            filter: {
              name: "Hyper Driver",
            },
          },
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
    ability10MorePowerGetsOverpower: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: { type: "subject-property", property: "power", basis: "current" },
        comparison: { op: "gte", value: 10 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: overpower,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { yellow: moonshotYellow } = moonshot.cards;
