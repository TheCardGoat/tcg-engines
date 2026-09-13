import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const zephyr: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "idaRe7y3In",
  slug: "zephyr",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "idaRe7y3In:face:default",
      catalogId: "idaRe7y3In",
      name: "Zephyr",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Suppress target ally or regalia. (To suppress an object, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
      abilities: [
        {
          id: "idaRe7y3In-a1",
          kind: "card-resolution",
          text: "Suppress target ally or regalia. (To suppress an object, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
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
                  kind: "any",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "supertype",
                      oneOf: ["REGALIA"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default zephyr;
