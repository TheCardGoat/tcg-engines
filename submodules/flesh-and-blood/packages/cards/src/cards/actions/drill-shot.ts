import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/drill-shot.generated.ts";
const abilities = {
  continuousGrantProperty: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "has-counter",
      counter: {
        kind: "named",
        name: "aim",
      },
      target: {
        selector: "self",
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "piercing",
          value: 1,
        },
      },
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
  onHitAddCounterDefense: {
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
        type: "add-counter",
        counter: {
          kind: "numeric",
          value: -1,
          property: "defense",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
      },
    },
  },
} as const;
export const drillShot = definePitchFamily(fabPitchFamilies["drill-shot"], {
  abilities: () => ({ ...abilities }),
});
export const { red: drillShotRed, yellow: drillShotYellow, blue: drillShotBlue } = drillShot.cards;
