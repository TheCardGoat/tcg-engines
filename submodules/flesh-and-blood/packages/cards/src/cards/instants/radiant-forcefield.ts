import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/radiant-forcefield.generated.ts";

export const radiantForcefield = definePitchFamily(fabPitchFamilies["radiant-forcefield"], {
  abilities: () => ({
    ifHeroWouldBeDealtDamageBanishFromHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        optionalCost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: 1,
        },
        duration: "while-in-arena",
      },
    },
    whenThereAreNoHeroSSoulDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "state",
        state: {
          type: "zone-count",
          zone: "soul",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { yellow: radiantForcefieldYellow } = radiantForcefield.cards;
