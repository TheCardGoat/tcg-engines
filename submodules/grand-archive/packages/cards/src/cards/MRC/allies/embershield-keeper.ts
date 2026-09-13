import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embershieldKeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xhi5jnsl7d",
  slug: "embershield-keeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xhi5jnsl7d:face:default",
      catalogId: "xhi5jnsl7d",
      name: "Embershield Keeper",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 2,
      },
      rulesText:
        "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.) \n\n[Class Bonus] As long as Embershield Keeper is fostered, it gets +2 LIFE.",
      abilities: [
        {
          id: "xhi5jnsl7d-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Foster (At the beginning of your recollection phase, if this ally hasn’t been dealt damage since the end of your previous turn, it becomes fostered.)",
          keyword: {
            name: "foster",
          },
        },
        {
          id: "xhi5jnsl7d-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as Embershield Keeper is fostered, it gets +2 LIFE.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "fostered",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default embershieldKeeper;
