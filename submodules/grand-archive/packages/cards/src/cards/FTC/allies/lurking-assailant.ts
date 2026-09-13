import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lurkingAssailant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uq2r6v374c",
  slug: "lurking-assailant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uq2r6v374c:face:default",
      catalogId: "uq2r6v374c",
      name: "Lurking Assailant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Lurking Assailant has stealth as long as it's awake.\n\n[Level 1+] Lurking Assailant may retaliate against attackers while not defending. ",
      abilities: [
        {
          id: "uq2r6v374c-a1",
          kind: "static",
          staticKind: "effects",
          text: "Lurking Assailant has stealth as long as it's awake.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
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
                  name: "stealth",
                },
              },
            },
          ],
        },
        {
          id: "uq2r6v374c-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] Lurking Assailant may retaliate against attackers while not defending.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "retaliate",
              subject: {
                kind: "source",
              },
              against: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  filter: {
                    kind: "object-state",
                    state: "attacking",
                  },
                },
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "object-state",
                  subject: {
                    kind: "source",
                  },
                  state: "defending",
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

export default lurkingAssailant;
