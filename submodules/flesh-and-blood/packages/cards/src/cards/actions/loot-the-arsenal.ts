import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/loot-the-arsenal.generated.ts";

export const lootTheArsenal = definePitchFamily(fabPitchFamilies["loot-the-arsenal"], {
  keywords: [goAgain],
  abilities: () => ({
    nextPirateAllyAttackTurnGetsHitsDestroyArsenalCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsDestroyArsenalCreateGoldToken",
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
                type: "if-you-do",
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
                then: {
                  type: "create-token",
                  token: "gold",
                  controller: "controller",
                },
              },
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            and: [
              {
                typeBox: {
                  supertypes: ["Pirate"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { blue: lootTheArsenalBlue } = lootTheArsenal.cards;
