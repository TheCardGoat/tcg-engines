import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/dusk-path-pilgrimage.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const duskPathPilgrimage = definePitchFamily(fabPitchFamilies["dusk-path-pilgrimage"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionSequence: {
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
                  types: ["Weapon"],
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
                id: "staticTriggeredHitOptionalModifyActivationLimit",
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
                  // CR 5.2.3c: the hit grants the allowance by itself; "you
                  // may" is the later activation choice.
                  effect: {
                    type: "modify-activation-limit",
                    target: {
                      selector: "self",
                    },
                    operation: "additional",
                    count: 1,
                    duration: "this-turn",
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
                  types: ["Weapon"],
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
  red: duskPathPilgrimageRed,
  yellow: duskPathPilgrimageYellow,
  blue: duskPathPilgrimageBlue,
} = duskPathPilgrimage.cards;
