import { goAgain, spectra } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ode-to-wrath.generated.ts";

export const odeToWrath = definePitchFamily(fabPitchFamilies["ode-to-wrath"], {
  keywords: [spectra],
  abilities: () => ({
    wheneverSourceControlDealsDamageOpponentTheyLose1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "lose-life",
          amount: 1,
          target: {
            selector: "attack-target",
          },
        },
      },
    },
    illusionistAttackActionControlGetGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent", "combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Illusionist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: odeToWrathYellow } = odeToWrath.cards;
