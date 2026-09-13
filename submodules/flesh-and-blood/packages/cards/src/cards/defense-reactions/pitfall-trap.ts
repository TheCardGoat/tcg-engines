import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/pitfall-trap.generated.ts";

export const pitfallTrap = definePitchFamily(fabPitchFamilies["pitfall-trap"], {
  abilities: () => ({
    arsenalOnly: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "played-this",
        per: "turn",
        onlySource: true,
        filter: { playedFromZones: ["arsenal"] },
      },
      playEffect: {
        role: "condition",
      },
    },
    damageUnlessAttackerPays: {
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
          type: "unless",
          effect: {
            type: "deal-damage",
            damageType: "generic",
            amount: 2,
            target: {
              selector: "attacking-hero",
            },
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "attacking-hero",
          },
        },
      },
    },
  }),
});

export const { yellow: pitfallTrapYellow } = pitfallTrap.cards;
