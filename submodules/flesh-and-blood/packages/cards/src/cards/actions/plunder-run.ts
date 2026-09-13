import { attackActionFilter, nextAttackAction, plusPower } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plunder-run.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const plunderRun = definePitchFamily(fabPitchFamilies["plunder-run"], {
  parameters: {
    red: { powerBonus: 3 },
    yellow: { powerBonus: 2 },
    blue: { powerBonus: 1 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    drawOnNextAttackHit: {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: { kind: "any" },
            filter: attackActionFilter(),
            bindAs: "it",
          },
        },
      },
      policy: { kind: "windowed", duration: "this-turn", matching: "first" },
      resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
    },
    empowerFromArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "played-card" },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: nextAttackAction({ grant: plusPower(powerBonus) }),
      },
    },
  }),
});

export const {
  red: plunderRunRed,
  yellow: plunderRunYellow,
  blue: plunderRunBlue,
} = plunderRun.cards;
