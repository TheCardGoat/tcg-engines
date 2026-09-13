import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-the-dragon-scale.generated.ts";

export const artOfTheDragonScale = definePitchFamily(fabPitchFamilies["art-of-the-dragon-scale"], {
  abilities: () => ({
    whenAttacksIfIsDraconicGetsWhenHitsHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenHitsHeroPut1CounterEquipmentTheyControl",
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
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});
export const { red: artOfTheDragonScaleRed } = artOfTheDragonScale.cards;
