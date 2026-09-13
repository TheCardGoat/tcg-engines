import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cordeliaAurousKaiser: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4mwrg35j36",
  slug: "cordelia-aurous-kaiser",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4mwrg35j36:face:default",
      catalogId: "4mwrg35j36",
      name: "Cordelia, Aurous Kaiser",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NEOS"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "On Enter: Summon two Automaton Drone tokens. \n\n[Class Bonus] Token objects you control have reservable. (While paying for a reserve cost, you may rest objects with reservable to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "4mwrg35j36-a1",
          kind: "triggered",
          text: "On Enter: Summon two Automaton Drone tokens.",
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
            object: "Automaton Drone",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
          },
        },
        {
          id: "4mwrg35j36-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Token objects you control have reservable. (While paying for a reserve cost, you may rest objects with reservable to pay for 1 of that cost.)",
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
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "token",
                        value: true,
                      },
                      {
                        kind: "subtype",
                        oneOf: ["TOKEN"],
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
                kind: "grant-keyword",
                keyword: {
                  name: "reservable",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default cordeliaAurousKaiser;
