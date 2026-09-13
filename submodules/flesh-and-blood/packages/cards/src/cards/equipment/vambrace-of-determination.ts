import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vambrace-of-determination.generated.ts";

export const vambraceOfDetermination = defineCard(
  fabCardIdentitiesByCanonicalId["KTjmk7Th7CGNPfmL6CDnD"],
  {
    abilities: {
      oncePerTurnAttackReactionNextPreventionEffectPrevents: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack-reaction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "prevent",
            damageType: "physical",
          },
          modification: {
            type: "modify-numeric",
            property: "power",
            op: "subtract",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          duration: "this-turn",
          limit: {
            count: 1,
            per: "turn",
          },
        },
      },
      whenDefendsMayPayIfDoGains1Blade: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
                {
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: bladeBreak,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
        },
      },
    },
  },
);
