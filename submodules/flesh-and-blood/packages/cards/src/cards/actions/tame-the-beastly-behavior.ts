import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tame-the-beastly-behavior.generated.ts";

export const tameTheBeastlyBehavior = definePitchFamily(
  fabPitchFamilies["tame-the-beastly-behavior"],
  {
    abilities: () => ({
      whenAttacksReviledHeroGetsNumber1Power: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Reviled"],
                },
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
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
      },
      whenHitsReviledHeroPutFromTheirArsenalOnBottomTheirDeck: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  supertypes: ["Reviled"],
                },
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["arsenal"],
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
    }),
  },
);

export const { red: tameTheBeastlyBehaviorRed } = tameTheBeastlyBehavior.cards;
