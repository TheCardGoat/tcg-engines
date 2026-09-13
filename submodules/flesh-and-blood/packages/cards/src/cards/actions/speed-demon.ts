import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/speed-demon.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const speedDemon = definePitchFamily(fabPitchFamilies["speed-demon"], {
  keywords: [scrap],
  abilities: () => ({
    controlHyperDriverGetsNumber1Power: {
      kind: "resolution",
      condition: {
        type: "control-object",
        filter: {
          name: "Hyper Driver",
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
    whenAttacksScrappedHyperDriverCreateHyperDriverTokenWithNumber2Steam: {
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
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "has-status",
          status: "scrapped-hyper-driver",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "hyper-driver",
          controller: "controller",
          withCounters: {
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 2,
          },
        },
      },
    },
  }),
});

export const { red: speedDemonRed } = speedDemon.cards;
