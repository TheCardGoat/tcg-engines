import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/engulfing-light.generated.ts";
const abilities = {
  charge: {
    kind: "static",
    staticKind: "play",
    playEffect: {
      role: "additional-cost",
      cost: {
        class: "effect",
        type: "charge",
      },
      optional: true,
    },
    label: {
      name: "charge",
    },
  },
  moveToSoulOnHitIfCharged: {
    kind: "resolution",
    condition: {
      type: "performed-this-turn",
      event: "charge",
      player: "controller",
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          kind: "static",
          staticKind: "triggered",
          id: "moveToSoulOnHit",
          text: "",
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
              type: "move-card",
              target: {
                selector: "self",
              },
              to: {
                zone: "soul",
              },
            },
          },
        },
      },
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
    label: {
      name: "charge",
    },
  },
} as const;
export const engulfingLight = definePitchFamily(fabPitchFamilies["engulfing-light"], {
  abilities: () => abilities,
});
export const {
  red: engulfingLightRed,
  yellow: engulfingLightYellow,
  blue: engulfingLightBlue,
} = engulfingLight.cards;
