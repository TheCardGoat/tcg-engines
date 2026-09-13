import { overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pay-up.generated.ts";

export const payUp = definePitchFamily(fabPitchFamilies["pay-up"], {
  abilities: () => ({
    defendingControlsGoldGetsOverpower: {
      kind: "resolution",
      condition: {
        type: "control-object",
        player: "opponent",
        filter: {
          name: "Gold",
        },
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
    hitsGainGoldTokenDontDeal1Damage: {
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
          type: "unless",
          effect: {
            type: "deal-damage",
            damageType: "generic",
            amount: 1,
            target: {
              selector: "attack-target",
            },
          },
          escape: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                name: "Gold",
              },
              count: 1,
            },
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { red: payUpRed } = payUp.cards;
