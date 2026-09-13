import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/path-of-same-ends.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const pathOfSameEnds = definePitchFamily(fabPitchFamilies["path-of-same-ends"], {
  keywords: { red: [], yellow: [goAgain], blue: [goAgain] },
  abilities: () => ({
    triggeredAttackSequenceDealDamageConditionalBindingNumericGrantPropertyThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "arcane",
              amount: 1,
              target: {
                selector: "attack-target",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: goAgain,
                },
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
    instantResourcesGrantPropertyThisTurn: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: pathOfSameEndsRed,
  yellow: pathOfSameEndsYellow,
  blue: pathOfSameEndsBlue,
} = pathOfSameEnds.cards;
