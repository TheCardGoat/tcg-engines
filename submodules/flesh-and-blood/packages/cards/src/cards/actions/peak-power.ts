import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/peak-power.generated.ts";
import { overpower } from "../shared/keywords.ts";

export const peakPower = definePitchFamily(fabPitchFamilies["peak-power"], {
  abilities: () => ({
    whenAttacksRevealTopGrantOverpowerIfSixBasePower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  numeric: [
                    { property: "power", basis: "base", comparison: { op: "gte", value: 6 } },
                  ],
                },
              },
              then: {
                type: "grant-property",
                property: { kind: "keyword", keyword: overpower },
                target: { selector: "self" },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: peakPowerRed, yellow: peakPowerYellow, blue: peakPowerBlue } = peakPower.cards;
