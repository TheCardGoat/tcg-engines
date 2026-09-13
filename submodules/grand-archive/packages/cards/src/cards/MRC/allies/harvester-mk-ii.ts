import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const harvesterMkIi: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ttkat9hreq",
  slug: "harvester-mk-ii",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ttkat9hreq:face:default",
      catalogId: "ttkat9hreq",
      name: "Harvester Mk II",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText: "Automaton allies you control have “On Death: Summon a Powercell token.”",
      abilities: [
        {
          id: "ttkat9hreq-a1",
          kind: "static",
          staticKind: "effects",
          text: "Automaton allies you control have “On Death: Summon a Powercell token.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
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
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1aka1f6-a1",
                  kind: "triggered",
                  text: "On Death: Summon a Powercell token.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-died",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  effect: {
                    kind: "summon",
                    object: "Powercell",
                    controller: "controller",
                    bindResultAs: "summoned-token",
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

export default harvesterMkIi;
