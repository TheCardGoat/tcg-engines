import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strengthenTheBonds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0v893yn5iq",
  slug: "strengthen-the-bonds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0v893yn5iq:face:default",
      catalogId: "0v893yn5iq",
      name: "Strengthen the Bonds",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATEBOUND", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "Put a buff counter on up to two target Fatestone or Fatebound objects.",
      abilities: [
        {
          id: "0v893yn5iq-a1",
          kind: "card-resolution",
          text: "Put a buff counter on up to two target Fatestone or Fatebound objects.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "subtype",
                      oneOf: ["FATESTONE"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FATEBOUND"],
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

export default strengthenTheBonds;
