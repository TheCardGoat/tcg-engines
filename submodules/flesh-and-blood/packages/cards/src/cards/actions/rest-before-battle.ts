import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rest-before-battle.generated.ts";

export const restBeforeBattle = definePitchFamily(fabPitchFamilies["rest-before-battle"], {
  abilities: () => ({
    playRestriction: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "weapon-attacks-this-turn", player: "controller" },
        comparison: { op: "gte", value: 1 },
      },
      playEffect: { role: "condition" },
    },
    startOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "none" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            { type: "destroy", target: { selector: "self" } },
            { type: "draw", count: 1, player: "controller" },
          ],
        },
      },
    },
  }),
});

export const { yellow: restBeforeBattleYellow } = restBeforeBattle.cards;
