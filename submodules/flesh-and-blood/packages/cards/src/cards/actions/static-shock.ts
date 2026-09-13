import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/static-shock.generated.ts";

export const staticShock = definePitchFamily(fabPitchFamilies["static-shock"], {
  abilities: () => ({
    dealArcaneDamageOnHitAfterLightning: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              supertypes: ["Lightning"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "attack-target",
          },
        },
      },
      label: {
        name: "lightning-flow",
      },
    },
  }),
});

export const { red: staticShockRed, yellow: staticShockYellow } = staticShock.cards;
