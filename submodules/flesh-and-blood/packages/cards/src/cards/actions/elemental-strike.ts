import { dominate, goAgain } from "../shared/keywords.ts";

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/elemental-strike.generated.ts";

const talentFilter = (talent: "Earth" | "Lightning" | "Ice") => ({
  type: "binding-matches" as const,
  binding: "it",
  filter: {
    typeBox: {
      supertypes: [talent],
    },
  },
});

export const elementalStrike = definePitchFamily(fabPitchFamilies["elemental-strike"], {
  abilities: () => ({
    asAdditionalCostPlayBanishFromHandIfS: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "hand",
          count: 1,
          filter: {},
        },
      },
    },
    ifBanishedIsEarthGets2: {
      kind: "resolution",
      condition: talentFilter("Earth"),
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
    ifBanishedIsLightningGetsGoAgain: {
      kind: "resolution",
      condition: talentFilter("Lightning"),
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
    ifBanishedIsIceGetsDominate: {
      kind: "resolution",
      condition: talentFilter("Ice"),
      effect: {
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
  }),
});
export const { red: elementalStrikeRed } = elementalStrike.cards;
