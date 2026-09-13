import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chateauDeCoeurs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vxc8u5zz08",
  slug: "chateau-de-coeurs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vxc8u5zz08:face:default",
      catalogId: "vxc8u5zz08",
      name: "Chateau de Coeurs",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["CLERIC", "TAMER"],
        subtypes: ["CLERIC", "TAMER", "SIEGEABLE", "CASTLE"],
      },
      elements: ["NORM"],
      stats: {
        durability: 5,
      },
      rulesText:
        "On Enter: Remove all buff counters from all objects you don't control. \n\nBuff counters can't be placed on objects you don't control.",
      abilities: [
        {
          id: "vxc8u5zz08-a1",
          kind: "triggered",
          text: "On Enter: Remove all buff counters from all objects you don't control.",
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
            kind: "remove-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "each-opponent",
              },
            },
            counter: "buff",
            amount: {
              kind: "all",
            },
            bindResultAs: "removed-counters",
          },
        },
        {
          id: "vxc8u5zz08-a2",
          kind: "static",
          staticKind: "effects",
          text: "Buff counters can't be placed on objects you don't control.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "add-counter",
              counter: "buff",
              subject: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-opponent",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default chateauDeCoeurs;
