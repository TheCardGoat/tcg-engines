import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-the-dragon-claw.generated.ts";

export const artOfTheDragonClaw = definePitchFamily(fabPitchFamilies["art-of-the-dragon-claw"], {
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
              id: "whenHitsHeroDestroyAllTheirArsenal",
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
                    zones: ["arsenal"],
                    count: {
                      type: "all",
                    },
                  },
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
export const { red: artOfTheDragonClawRed } = artOfTheDragonClaw.cards;
