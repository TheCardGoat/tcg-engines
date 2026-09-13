import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/tripwire-trap.generated.ts";

export const tripwireTrap = definePitchFamily(fabPitchFamilies["tripwire-trap"], {
  abilities: () => ({
    playOnlyFromArsenal: {
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
    taxHitTriggers: {
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
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "attacking-hero",
          },
          effect: {
            type: "rule-modification",
            mode: "restrict",
            action: "trigger",
            filter: {
              hasStatus: "attack-hit-this-chain-link",
            },
            duration: "this-combat-chain",
          },
        },
      },
    },
  }),
});

export const { red: tripwireTrapRed } = tripwireTrap.cards;
