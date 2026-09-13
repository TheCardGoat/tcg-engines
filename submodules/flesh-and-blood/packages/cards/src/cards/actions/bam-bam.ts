import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bam-bam.generated.ts";

export const bamBam = definePitchFamily(fabPitchFamilies["bam-bam"], {
  abilities: () => ({
    whenHitsHeroDestroyItemTheyControl: {
      kind: "static",
      staticKind: "triggered",
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
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Item"],
              },
            },
            count: 1,
          },
        },
      },
    },
    instantDiscardClubAttacksTurnGetWhenHitsHero: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "whenHitsHeroDestroyItemTheyControl",
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
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                  count: 1,
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
              subtypes: ["Club"],
            },
          },
        },
      },
    },
  }),
});
export const { yellow: bamBamYellow } = bamBam.cards;
