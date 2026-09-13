import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfReverentGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5wdysg327b",
  slug: "maiden-of-reverent-gale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5wdysg327b:face:default",
      catalogId: "5wdysg327b",
      name: "Maiden of Reverent Gale",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "APPARITION"],
      },
      elements: ["WIND"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Intercept\n\n[Diao Chan Bonus] On Death: Return target wind element Spell action card from your graveyard to your memory. (Trigger this ability only if your champion is Diao Chan.)",
      abilities: [
        {
          id: "5wdysg327b-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "5wdysg327b-a2",
          kind: "triggered",
          text: "[Diao Chan Bonus] On Death: Return target wind element Spell action card from your graveyard to your memory. (Trigger this ability only if your champion is Diao Chan.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "type",
                      oneOf: ["ACTION"],
                    },
                  ],
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
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default maidenOfReverentGale;
