import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tonorisGenesisAegis: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ta6qsesw2u",
  slug: "tonoris-genesis-aegis",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ta6qsesw2u:face:default",
      catalogId: "ta6qsesw2u",
      name: "Tonoris, Genesis Aegis",
      lineageName: "Tonoris",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NEOS"],
      stats: {
        level: 3,
        life: 30,
      },
      rulesText:
        "Tonoris Lineage\n\nAt the beginning of your recollection phase, choose one that hasn’t been chosen— \n• Summon an Obelisk of Armaments token.\n• Summon an Obelisk of Fabrication token.\n• Summon an Obelisk of Protection token.",
      abilities: [
        {
          id: "ta6qsesw2u-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Tonoris Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Tonoris",
          },
        },
        {
          id: "ta6qsesw2u-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, choose one that hasn’t been chosen—\n• Summon an Obelisk of Armaments token.\n• Summon an Obelisk of Fabrication token.\n• Summon an Obelisk of Protection token.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: 1,
            },
            excludePreviouslyChosen: true,
            trackChosenAs: "chosen-modes",
            modes: [
              {
                id: "mode-1",
                text: "Summon an Obelisk of Armaments token.",
                effect: {
                  kind: "summon",
                  object: "Obelisk of Armaments",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
              {
                id: "mode-2",
                text: "Summon an Obelisk of Fabrication token.",
                effect: {
                  kind: "summon",
                  object: "Obelisk of Fabrication",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
              {
                id: "mode-3",
                text: "Summon an Obelisk of Protection token",
                effect: {
                  kind: "summon",
                  object: "Obelisk of Protection",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default tonorisGenesisAegis;
