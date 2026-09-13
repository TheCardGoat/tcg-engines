import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/savor-bloodshed.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const savorBloodshed = definePitchFamily(fabPitchFamilies["savor-bloodshed"], {
  supertypeSets: [["Assassin"], ["Warrior"]],
  keywords: [goAgain],
  abilities: () => ({
    nextDaggerAttackTurnGetsNumber4Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
        },
      },
    },
    nextTimeHitMarkedHeroWithDaggerTurnDraw: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
                hasStatus: "marked",
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
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
  }),
});

export const { red: savorBloodshedRed } = savorBloodshed.cards;
