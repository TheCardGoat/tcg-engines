import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulping.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): dominate and go again are conditional grants,
 * not static keywords. "If a card with 6 or more {p} is discarded this way"
 * binds the random discard (PEN002 buzzard-helm / LEV003 meataxe pattern);
 * has-status discarded-this-way-card-with-6-or-more-p is never stamped. */
export const pulping = definePitchFamily(fabPitchFamilies["pulping"], {
  abilities: () => ({
    triggeredAttackSequenceDrawDiscardConditionalBindingMatchesGrantPropertyThisTurn: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  power: { op: "gte", value: 6 },
                },
              },
              then: {
                type: "grant-property",
                property: {
                  kind: "keyword",
                  keyword: dominate,
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
    whileHasStatusDefendedByFewerThan2NonEquipmentCardsGrantPropertyThisChainLink: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "defended-by-fewer-than-2-non-equipment-cards",
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
        duration: "this-chain-link",
      },
    },
  }),
});

export const { red: pulpingRed, yellow: pulpingYellow, blue: pulpingBlue } = pulping.cards;
