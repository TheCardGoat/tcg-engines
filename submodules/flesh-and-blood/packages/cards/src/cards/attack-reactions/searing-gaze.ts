import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/searing-gaze.generated.ts";

export const searingGaze = definePitchFamily(fabPitchFamilies["searing-gaze"], {
  abilities: () => ({
    boostAndMarkOnHit: {
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
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "chain-links",
                player: "controller",
                filter: { typeBox: { supertypes: ["Draconic"] } },
              },
              comparison: { op: "gte", value: 2 },
            },
            then: {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "markHeroOnHit",
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
                selector: "binding",
                binding: "it",
              },
              duration: "permanent",
            },
          },
        ],
      },
    },
  }),
});

export const { red: searingGazeRed } = searingGaze.cards;
