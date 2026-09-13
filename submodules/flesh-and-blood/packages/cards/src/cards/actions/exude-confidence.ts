import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/exude-confidence.generated.ts";

export const exudeConfidence = definePitchFamily(fabPitchFamilies["exude-confidence"], {
  abilities: () => ({
    whileExudeConfidenceIsnTDefendedByEqualGreater: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "not",
        condition: {
          type: "has-status",
          status: "defended-by-card-with-equal-or-greater-power",
        },
      },
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "play",
        filter: {
          or: [
            {
              typeBox: {
                types: ["Instant"],
              },
            },
            {
              typeBox: {
                types: ["Defense Reaction"],
              },
            },
          ],
        },
        duration: "this-combat-chain",
      },
    },
    instantExudeConfidenceGains2ActivateAbilityOnlyWhile: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      condition: {
        type: "has-status",
        status: "attacking",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: exudeConfidenceRed } = exudeConfidence.cards;
