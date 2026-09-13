import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/revel-in-runeblood.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): printed "another non-attack" uses the implemented attack+non-attack-this-turn marker. */
export const revelInRuneblood = definePitchFamily(fabPitchFamilies["revel-in-runeblood"], {
  keywords: [goAgain],
  abilities: () => ({
    playedAttackActionAnotherNonAttackActionTurnCreate4RunechantTokens: {
      kind: "resolution",
      condition: {
        type: "and",
        conditions: [
          {
            type: "played-this",
            per: "turn",
            filter: attackActionFilter(),
            comparison: { op: "gte", value: 1 },
          },
          {
            type: "played-this",
            per: "turn",
            filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
            comparison: { op: "gte", value: 1 },
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
        count: 4,
      },
    },
    beginningEndPhaseDestroyAllRunechants: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                name: "Runechant",
              },
              count: {
                type: "all",
              },
            },
          },
        },
      },
    },
  }),
});

export const { red: revelInRunebloodRed } = revelInRuneblood.cards;
