import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kongmingFelEidolon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7x2v4tdop1",
  slug: "kongming-fel-eidolon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7x2v4tdop1:face:default",
      catalogId: "7x2v4tdop1",
      name: "Kongming, Fel Eidolon",
      lineageName: "Kongming",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["TERA"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        "Kongming Lineage\n\nOn Enter: Recover X, where X is the amount of tera element cards in your banishment.\n\nWhenever you activate a Spell card, you may change the direction of your Shifting Currents to an adjacent direction of your choice.",
      abilities: [
        {
          id: "7x2v4tdop1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kongming Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Kongming",
          },
        },
        {
          id: "7x2v4tdop1-a2",
          kind: "triggered",
          text: "On Enter: Recover X, where X is the amount of tera element cards in your banishment.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["TERA"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: {
              kind: "variable",
              symbol: "X",
            },
          },
        },
        {
          id: "7x2v4tdop1-a3",
          kind: "triggered",
          text: "Whenever you activate a Spell card, you may change the direction of your Shifting Currents to an adjacent direction of your choice.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose-direction",
              player: "controller",
              state: "shifting-currents",
              directions: ["north", "east", "south", "west"],
              differentFromCurrent: true,
              relationToCurrent: "adjacent",
            },
          },
        },
      ],
    },
  },
};

export default kongmingFelEidolon;
