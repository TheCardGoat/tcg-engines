import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const airshipCaptain: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "t9hreqhj1t",
  slug: "airship-captain",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "t9hreqhj1t:face:default",
      catalogId: "t9hreqhj1t",
      name: "Airship Captain",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Whenever a domain enters the field under your control, deal 2 damage to target champion.",
      abilities: [
        {
          id: "t9hreqhj1t-a1",
          kind: "triggered",
          text: "Whenever a domain enters the field under your control, deal 2 damage to target champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["DOMAIN"],
                },
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default airshipCaptain;
