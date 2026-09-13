import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tenacity.generated.ts";

export const tenacity = definePitchFamily(fabPitchFamilies["tenacity"], {
  abilities: () => ({
    whenAttacksGetsXPowerWhereXNumberDefendingOnCombatChain: {
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: {
            type: "count",
            what: "cards-defending",
            per: "chain-link",
          },
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { yellow: tenacityYellow } = tenacity.cards;
