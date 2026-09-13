import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/wall-of-meat-and-muscle.generated.ts";

export const wallOfMeatAndMuscle = definePitchFamily(fabPitchFamilies["wall-of-meat-and-muscle"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  abilities: () => ({
    recoverAttackWhenControllingMight: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "control-object",
          filter: {
            name: "Might",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: attackActionFilter(),
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        },
      },
    },
  }),
});

export const { red: wallOfMeatAndMuscleRed } = wallOfMeatAndMuscle.cards;
