import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nocturnalBlossom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "39srnovht1",
  slug: "nocturnal-blossom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "39srnovht1:face:default",
      catalogId: "39srnovht1",
      name: "Nocturnal Blossom",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 1,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nAt the beginning of your end phase, recover 1. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "39srnovht1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "39srnovht1-a2",
          kind: "triggered",
          text: "At the beginning of your end phase, recover 1. (To recover, remove that many damage counters from your champion.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default nocturnalBlossom;
