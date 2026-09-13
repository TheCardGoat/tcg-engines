import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const diablerie: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0plqbtjuxz",
  slug: "diablerie",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0plqbtjuxz:face:default",
      catalogId: "0plqbtjuxz",
      name: "Diablerie",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time a regalia with divine relic would enter the field this turn, it enters the field under your control instead.\n\n[Vanitas Bonus] Floating Memory (Apply this effect only if your champion is Vanitas.)",
      abilities: [
        {
          id: "0plqbtjuxz-a1",
          kind: "card-resolution",
          text: "The next time a regalia with divine relic would enter the field this turn, it enters the field under your control instead.",
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
            operation: {
              kind: "modify-characteristic",
              change: {
                kind: "control",
                controller: "controller",
              },
            },
            duration: {
              kind: "for-next-event",
              event: "object-entered-field",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "0plqbtjuxz-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Vanitas Bonus] Floating Memory (Apply this effect only if your champion is Vanitas.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Vanitas",
              },
            },
          ],
        },
      ],
    },
  },
};

export default diablerie;
