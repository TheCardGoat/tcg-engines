import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tonorisMightOfHumanity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yevpmu6gvn",
  slug: "tonoris-might-of-humanity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yevpmu6gvn:face:default",
      catalogId: "yevpmu6gvn",
      name: "Tonoris, Might of Humanity",
      lineageName: "Tonoris",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 25,
      },
      rulesText:
        'Tonoris Lineage (Tonoris, Might of Humanity must be leveled from a previous level "Tonoris" champion.)\n\nOn Enter: Tonoris\' next attack this turn gets +3 POWER.',
      abilities: [
        {
          id: "yevpmu6gvn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Tonoris Lineage (Tonoris, Might of Humanity must be leveled from a previous level "Tonoris" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Tonoris",
          },
        },
        {
          id: "yevpmu6gvn-a2",
          kind: "triggered",
          text: "On Enter: Tonoris' next attack this turn gets +3 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "attack-declared",
                subject: {
                  kind: "source",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "continuous",
              subjects: {
                kind: "current-attack",
              },
              affectedSet: "locked",
              duration: {
                kind: "this-attack",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default tonorisMightOfHumanity;
