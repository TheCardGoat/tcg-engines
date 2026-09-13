import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const artificersOpus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "G5E0PIUd0W",
  slug: "artificers-opus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "G5E0PIUd0W:face:default",
      catalogId: "G5E0PIUd0W",
      name: "Artificer's Opus",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "CONSTRUCT", "GOLEM"],
      },
      elements: ["TERA"],
      stats: {
        power: 4,
        life: 8,
      },
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate.)\n\nArtificer's Opus enters the field rested.\n\nCleave (This ally attacks all units a chosen opponent controls. Its attacks can't be intercepted.)",
      abilities: [
        {
          id: "G5E0PIUd0W-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate.)",
          keyword: {
            name: "efficiency",
          },
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
        },
        {
          id: "G5E0PIUd0W-a2",
          kind: "static",
          staticKind: "effects",
          text: "Artificer's Opus enters the field rested.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "modify-object-state",
                state: "rested",
                value: true,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "G5E0PIUd0W-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave (This ally attacks all units a chosen opponent controls. Its attacks can't be intercepted.)",
          keyword: {
            name: "cleave",
          },
        },
      ],
    },
  },
};

export default artificersOpus;
