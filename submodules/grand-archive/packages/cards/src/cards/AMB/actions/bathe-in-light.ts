import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const batheInLight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "d9zax2g20h",
  slug: "bathe-in-light",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "d9zax2g20h:face:default",
      catalogId: "d9zax2g20h",
      name: "Bathe in Light",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Recover 4. (To recover, remove that many damage counters from your champion.)\n\nAt the beginning of your next recollection phase, recover 4.",
      abilities: [
        {
          id: "d9zax2g20h-a1",
          kind: "card-resolution",
          text: "Recover 4. (To recover, remove that many damage counters from your champion.)",
          effect: {
            kind: "recover",
            player: "controller",
            amount: 4,
          },
        },
        {
          id: "d9zax2g20h-a2",
          kind: "card-resolution",
          text: "At the beginning of your next recollection phase, recover 4.",
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "phase-begins",
                phase: "recollection",
                actor: "controller",
              },
            },
            effect: {
              kind: "recover",
              player: "controller",
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default batheInLight;
