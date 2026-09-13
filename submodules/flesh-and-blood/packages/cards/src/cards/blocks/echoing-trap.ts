import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/echoing-trap.generated.ts";
import { ambush } from "../shared/keywords.ts";
export const echoingTrap = definePitchFamily(fabPitchFamilies["echoing-trap"], {
  keywords: [ambush],
  abilities: () => ({
    echo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          defendedAttack: attackActionFilter(),
          bindDefendedAttackAs: "defended-attack",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "conditional",
          condition: {
            type: "compare-amount",
            amount: {
              type: "count",
              what: "cards-played-this-turn",
              groupBy: "name",
              player: "each",
              filter: { sameNameAs: { binding: "defended-attack" } },
            },
            comparison: { op: "gte", value: 2 },
          },
          then: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attacking-hero",
              zones: ["hand"],
              count: 1,
              chooser: "attacking-hero",
            },
          },
        },
      },
    },
  }),
});
export const { blue: echoingTrapBlue } = echoingTrap.cards;
