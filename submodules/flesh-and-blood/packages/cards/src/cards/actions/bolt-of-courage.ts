import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bolt-of-courage.generated.ts";

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
  drawOnHitIfCharged: {
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
          id: "drawCardOnHit",
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
              type: "draw",
              count: 1,
              player: "controller",
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

export const boltOfCourage = definePitchFamily(fabPitchFamilies["bolt-of-courage"], {
  abilities: () => abilities,
});

export const {
  red: boltOfCourageRed,
  yellow: boltOfCourageYellow,
  blue: boltOfCourageBlue,
} = boltOfCourage.cards;
