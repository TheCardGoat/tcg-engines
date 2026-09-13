import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/sharpening-sparks.generated.ts";

export const sharpeningSparks = definePitchFamily(fabPitchFamilies["sharpening-sparks"], {
  abilities: () => ({
    boostAndSharpenOnHit: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "sharpenSwordOnHit",
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
                    type: "sharpen",
                    target: {
                      selector: "self",
                    },
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
  }),
});

export const { red: sharpeningSparksRed } = sharpeningSparks.cards;
