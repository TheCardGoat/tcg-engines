import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/legacy-of-ikaru.generated.ts";

export const legacyOfIkaru = definePitchFamily(fabPitchFamilies["legacy-of-ikaru"], {
  abilities: () => ({
    boostAndDrawAfterEdgeOfAutumn: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Ninja"],
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
                id: "drawAfterEdgeOfAutumnOnHit",
                text: "",
                trigger: {
                  kind: "event-and-state",
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
                  state: {
                    type: "last-attack-this-combat-chain",
                    names: ["Edge Of Autumn"],
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
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  supertypes: ["Ninja"],
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

export const { blue: legacyOfIkaruBlue } = legacyOfIkaru.cards;
