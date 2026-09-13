import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pridesSmith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cb2c4o20mf",
  slug: "prides-smith",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cb2c4o20mf:face:default",
      catalogId: "cb2c4o20mf",
      name: "Pride's Smith",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ANIMAL", "HUMAN", "LION"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText: "On Enter: Put a durability counter on target Warrior weapon you control.",
      abilities: [
        {
          id: "cb2c4o20mf-a1",
          kind: "triggered",
          text: "On Enter: Put a durability counter on target Warrior weapon you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["WARRIOR"],
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
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default pridesSmith;
