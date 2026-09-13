import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/talisman-of-balance.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const talismanOfBalance = definePitchFamily(fabPitchFamilies["talisman-of-balance"], {
  keywords: [goAgain],
  abilities: () => ({
    atBeginningEndPhaseHaveLessInArsenalThanOpposingHeroDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "arsenal",
            player: "controller",
          },
          comparison: {
            op: "lt",
            value: {
              type: "count",
              what: "cards-in-zone",
              zone: "arsenal",
              player: "opponent",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-down",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: talismanOfBalanceBlue } = talismanOfBalance.cards;
