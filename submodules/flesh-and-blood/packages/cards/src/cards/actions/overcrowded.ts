import { ambush } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overcrowded.generated.ts";

export const overcrowded = definePitchFamily(fabPitchFamilies["overcrowded"], {
  keywords: [ambush],
  abilities: () => ({
    attacksDefendsGets1Power1DefenseDifferentNameAmongAuraTokensArena: {
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
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "count",
                what: "different-names-among-aura-tokens",
              },
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            {
              type: "modify-numeric",
              property: "defense",
              op: "add",
              amount: {
                type: "count",
                what: "different-names-among-aura-tokens",
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
    attacksDefendsGets1Power1DefenseDifferentNameAmongAuraTokensArenaTriggeredDefendSequenceModifyNumericPowerCountPermanentModifyNumericDefenseCountPermanent:
      {
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
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: {
                  type: "count",
                  what: "different-names-among-aura-tokens",
                },
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: {
                  type: "count",
                  what: "different-names-among-aura-tokens",
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
  }),
});

export const { blue: overcrowdedBlue } = overcrowded.cards;
