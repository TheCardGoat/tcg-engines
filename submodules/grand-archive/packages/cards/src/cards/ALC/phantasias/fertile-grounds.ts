import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fertileGrounds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8bls6g7xgw",
  slug: "fertile-grounds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8bls6g7xgw:face:default",
      catalogId: "8bls6g7xgw",
      name: "Fertile Grounds",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, summon a token copy of an Herb item you control.",
      abilities: [
        {
          id: "8bls6g7xgw-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, summon a token copy of an Herb item you control.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "copied-object",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["HERB"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "summon",
              copyOf: {
                kind: "bound",
                binding: "copied-object",
              },
              controller: "controller",
              bindResultAs: "summoned-token",
            },
          },
        },
      ],
    },
  },
};

export default fertileGrounds;
