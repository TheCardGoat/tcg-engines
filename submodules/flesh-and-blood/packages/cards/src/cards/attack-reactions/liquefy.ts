import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/liquefy.generated.ts";

export const liquefy = definePitchFamily(fabPitchFamilies["liquefy"], {
  abilities: () => ({
    grantEquipmentCorrosionOnHit: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "played-at-chain-link-4-or-higher",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "reduceEquipmentDefenseAndDestroyOnHit",
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
                type: "sequence",
                steps: [
                  {
                    type: "add-counter",
                    counter: {
                      kind: "numeric",
                      value: -1,
                      property: "defense",
                    },
                    count: 1,
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          types: ["Equipment"],
                        },
                      },
                      count: 1,
                    },
                  },
                  {
                    type: "conditional",
                    condition: {
                      type: "binding-matches",
                      binding: "it",
                      filter: {
                        defense: {
                          op: "eq",
                          value: 0,
                        },
                      },
                    },
                    then: {
                      type: "destroy",
                      target: {
                        selector: "binding",
                        binding: "it",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: attackActionFilter(),
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
      label: {
        name: "rupture",
      },
    },
  }),
});

export const { red: liquefyRed } = liquefy.cards;
