import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seeds-of-agony.generated.ts";
import { bloodDebt, goAgain } from "../shared/keywords.ts";

export const seedsOfAgony = definePitchFamily(fabPitchFamilies["seeds-of-agony"], {
  parameters: pitchMap({ red: 2, yellow: 1, blue: 0 }),
  keywords: [bloodDebt, goAgain],
  abilities: (maxCost) => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    resolutionGrantProperty: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "triggeredStaticOnAttackEffect",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
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
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "any-hero",
                },
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          cost: {
            op: "lte",
            value: maxCost,
          },
        }),
      },
    },
  }),
});

export const {
  red: seedsOfAgonyRed,
  yellow: seedsOfAgonyYellow,
  blue: seedsOfAgonyBlue,
} = seedsOfAgony.cards;
