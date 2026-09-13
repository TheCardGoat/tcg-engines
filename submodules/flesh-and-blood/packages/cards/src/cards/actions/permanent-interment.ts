import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/permanent-interment.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const permanentInterment = definePitchFamily(fabPitchFamilies["permanent-interment"], {
  keywords: [bloodDebt],
  abilities: () => ({
    onAttackPayTurnShadowBanishedGainPower: {
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
              type: "optional",
              effect: {
                type: "pay",
                cost: {
                  class: "asset",
                  type: "resources",
                  amount: { type: "up-to", amount: 3 },
                },
                payer: "controller",
              },
            },
            {
              type: "turn-face-down",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["banished"],
                filter: {
                  typeBox: { supertypes: ["Shadow"] },
                  hasStatus: "face-up",
                },
                count: { type: "count", what: "resources-paid-this-way" },
              },
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: { type: "count", what: "turned-face-down-this-way" },
              target: { selector: "self" },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: permanentIntermentRed,
  yellow: permanentIntermentYellow,
  blue: permanentIntermentBlue,
} = permanentInterment.cards;
