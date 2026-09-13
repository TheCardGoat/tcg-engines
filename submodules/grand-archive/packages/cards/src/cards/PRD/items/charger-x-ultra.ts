import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chargerXUltra: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AxUVNNipII",
  slug: "charger-x-ultra",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AxUVNNipII:face:default",
      catalogId: "AxUVNNipII",
      name: "Charger X Ultra",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "VELTECH", "DEVICE"],
      },
      elements: ["ARCANE"],
      stats: {},
      rulesText:
        "At the beginning of each player's recollection phase, put a static counter on target object with one or more static counters on it.",
      abilities: [
        {
          id: "AxUVNNipII-a1",
          kind: "triggered",
          text: "At the beginning of each player's recollection phase, put a static counter on target object with one or more static counters on it.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
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
                filter: {
                  kind: "has-counter",
                  counter: "static",
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
            counter: "static",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default chargerXUltra;
