import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hydratingFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LAfJuHgUbm",
  slug: "hydrating-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LAfJuHgUbm:face:default",
      catalogId: "LAfJuHgUbm",
      name: "Hydrating Fractal",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever your champion levels up, recover 1.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "LAfJuHgUbm-a1",
          kind: "triggered",
          text: "Whenever your champion levels up, recover 1.",
          trigger: {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "LAfJuHgUbm-a2",
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

export default hydratingFractal;
