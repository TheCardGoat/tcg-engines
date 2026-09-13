import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mercurialHeart: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7ddcgw05qz",
  slug: "mercurial-heart",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7ddcgw05qz:face:default",
      catalogId: "7ddcgw05qz",
      name: "Mercurial Heart",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ARTIFACT", "POWERCELL"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic (You can only have one card with this keyword in your material deck.)\n\nOn Enter: Put a buff counter on target Automaton ally you control.",
      abilities: [
        {
          id: "7ddcgw05qz-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic (You can only have one card with this keyword in your material deck.)",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "7ddcgw05qz-a2",
          kind: "triggered",
          text: "On Enter: Put a buff counter on target Automaton ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AUTOMATON"],
                    },
                  ],
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
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default mercurialHeart;
