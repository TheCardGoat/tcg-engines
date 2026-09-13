import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const atmosArmorTypeAres: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rh0foylxnq",
  slug: "atmos-armor-type-ares",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rh0foylxnq:face:default",
      catalogId: "rh0foylxnq",
      name: "Atmos Armor Type-Ares",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["NEOS"],
      stats: {
        power: 1,
        life: 5,
      },
      rulesText:
        "On Enter: Summon two Atmos Shield tokens.\n\n[Class Bonus] Atmos Armor Type-Ares gets +1 POWER for each ally named Atmos Shield you control.",
      abilities: [
        {
          id: "rh0foylxnq-a1",
          kind: "triggered",
          text: "On Enter: Summon two Atmos Shield tokens.",
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
            kind: "summon",
            object: "Atmos Shield",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
          },
        },
        {
          id: "rh0foylxnq-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Atmos Armor Type-Ares gets +1 POWER for each ally named Atmos Shield you control.",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "name",
                          value: "Atmos Shield",
                          match: "exact",
                        },
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SHIELD"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default atmosArmorTypeAres;
