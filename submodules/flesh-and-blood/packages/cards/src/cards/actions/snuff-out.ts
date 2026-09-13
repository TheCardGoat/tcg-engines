import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snuff-out.generated.ts";

export const snuffOut = definePitchFamily(fabPitchFamilies["snuff-out"], {
  abilities: () => ({
    whenHitsHeroDestroyAuraControlDoTheyDiscard: {
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
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "discard",
            target: {
              selector: "attack-target",
            },
          },
        },
      },
    },
  }),
});

export const { red: snuffOutRed } = snuffOut.cards;
