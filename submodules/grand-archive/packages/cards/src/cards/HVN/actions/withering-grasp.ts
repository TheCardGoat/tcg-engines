import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const witheringGrasp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wftz07gc85",
  slug: "withering-grasp",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wftz07gc85:face:default",
      catalogId: "wftz07gc85",
      name: "Withering Grasp",
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
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a wither counter on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)\n\n[Diao Chan Bonus] Draw a card into your memory.",
      abilities: [
        {
          id: "wftz07gc85-a1",
          kind: "card-resolution",
          text: "Put a wither counter on target non-champion object. (At the beginning of a player's main phase, if they control one or more objects with wither counters on them, for each of those objects, they sacrifice it unless they pay (1) for each wither counter on it, then remove wither counters.)",
          targets: [
            {
              id: "target-1",
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "wither",
            amount: 1,
          },
        },
        {
          id: "wftz07gc85-a2",
          kind: "card-resolution",
          text: "[Diao Chan Bonus] Draw a card into your memory.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default witheringGrasp;
