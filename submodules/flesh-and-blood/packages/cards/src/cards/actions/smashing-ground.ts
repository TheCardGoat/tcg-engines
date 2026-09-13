import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smashing-ground.generated.ts";

export const smashingGround = definePitchFamily(fabPitchFamilies["smashing-ground"], {
  abilities: () => ({
    hasNumber6MorePowerGetsWhenHitsHeroDestroyInTheirArsenal: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: {
          type: "subject-property",
          property: "power",
          basis: "current",
          missing: "zero",
        },
        comparison: { op: "gte", value: 6 },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyInTheirArsenal",
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
                target: {
                  kind: "hero",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["arsenal"],
                  filter: {},
                  count: 1,
                },
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});

export const { blue: smashingGroundBlue } = smashingGround.cards;
