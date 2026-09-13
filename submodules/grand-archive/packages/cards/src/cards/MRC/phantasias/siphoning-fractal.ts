import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const siphoningFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j43qiwqjt0",
  slug: "siphoning-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j43qiwqjt0:face:default",
      catalogId: "j43qiwqjt0",
      name: "Siphoning Fractal",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Whenever an ally dies, deal 1 damage to target champion you don’t control and recover 1.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "j43qiwqjt0-a1",
          kind: "triggered",
          text: "Whenever an ally dies, deal 1 damage to target champion you don’t control and recover 1.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          },
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
                relationship: "controlled-by",
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
        {
          id: "j43qiwqjt0-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default siphoningFractal;
