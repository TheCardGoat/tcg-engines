import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hunt-a-killer.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const huntAKiller = definePitchFamily(fabPitchFamilies["hunt-a-killer"], {
  parameters: { red: 4, yellow: 3, blue: 2 },
  keywords: [goAgain],
  abilities: (amount) => ({
    sequenceModifyNumericPowerThisTurnGrantPropertyTriggeredHitMarkThisTurn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
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
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "triggeredHitMark",
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
                    type: "mark",
                    target: {
                      selector: "attack-target",
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
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const {
  red: huntAKillerRed,
  yellow: huntAKillerYellow,
  blue: huntAKillerBlue,
} = huntAKiller.cards;
