import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aphoticRuin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g9g8lun4ol",
  slug: "aphotic-ruin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g9g8lun4ol:face:default",
      catalogId: "g9g8lun4ol",
      name: "Aphotic Ruin",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Diao Chan Bonus] Efficiency\nPut four wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
      abilities: [
        {
          id: "g9g8lun4ol-a1",
          kind: "card-resolution",
          text: "[Diao Chan Bonus] Efficiency\nPut four wither counters on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
          targets: [
            {
              id: "target-object",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-object",
            },
            counter: "wither",
            amount: 4,
          },
          keyword: {
            name: "efficiency",
          },
        },
      ],
    },
  },
};

export default aphoticRuin;
