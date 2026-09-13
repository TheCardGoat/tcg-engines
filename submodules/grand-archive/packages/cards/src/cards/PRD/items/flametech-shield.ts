import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flametechShield: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "U7pILTDm3s",
  slug: "flametech-shield",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "U7pILTDm3s:face:default",
      catalogId: "U7pILTDm3s",
      name: "FlameTech Shield",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "VELTECH", "SHIELD"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Ally Link\n\nLink Shield (If linked object would be destroyed, remove all temporary damage from it and destroy this object instead.)\n\nOn Enter: Draw a card, then discard a card.",
      abilities: [
        {
          id: "U7pILTDm3s-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ally Link",
          keyword: {
            name: "link",
            target: "ally",
          },
        },
        {
          id: "U7pILTDm3s-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Link Shield (If linked object would be destroyed, remove all temporary damage from it and destroy this object instead.)",
          keyword: {
            name: "link-shield",
          },
        },
        {
          id: "U7pILTDm3s-a3",
          kind: "triggered",
          text: "On Enter: Draw a card, then discard a card.",
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-card",
              },
            ],
          },
        },
      ],
    },
  },
};

export default flametechShield;
