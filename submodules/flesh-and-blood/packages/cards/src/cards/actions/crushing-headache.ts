import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/crushing-headache.generated.ts";

const revealedNonAttackAction = {
  typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] },
  inObjectBinding: "revealed-this-way",
} as const;

export const crushingHeadache = definePitchFamily(fabPitchFamilies["crushing-headache"], {
  abilities: () => ({
    crush: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["arsenal", "hand"],
              count: { type: "all" },
            },
          },
          {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["arsenal"],
              filter: revealedNonAttackAction,
              count: { type: "all" },
            },
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["hand"],
              filter: revealedNonAttackAction,
              count: { type: "all" },
            },
          },
        ],
      },
    }),
  }),
});

export const { red: crushingHeadacheRed } = crushingHeadache.cards;
