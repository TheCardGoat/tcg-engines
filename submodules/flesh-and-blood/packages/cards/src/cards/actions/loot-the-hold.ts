import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/loot-the-hold.generated.ts";

export const lootTheHold = definePitchFamily(fabPitchFamilies["loot-the-hold"], {
  keywords: [goAgain],
  abilities: () => ({
    nextPirateAllyAttackTurnGetsHitsDiscardCreateGoldToken: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "hitsDiscardCreateGoldToken",
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
                  type: "discard",
                  target: {
                    selector: "attack-target",
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

export const { blue: lootTheHoldBlue } = lootTheHold.cards;
