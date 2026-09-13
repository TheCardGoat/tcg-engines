import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meadowbloomDryad: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cVRIUJdTW5",
  slug: "meadowbloom-dryad",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cVRIUJdTW5:face:default",
      catalogId: "cVRIUJdTW5",
      name: "Meadowbloom Dryad",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DRYAD"],
      },
      elements: ["TERA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Preserve (When this ally dies, put it into your material deck preserved. As you materialize, you may instead return a preserved card to its owner's hand.)\n\n[Class Bonus] Whenever Meadowbloom Dryad or another ally enters the field under your control, put a buff counter on target ally.",
      abilities: [
        {
          id: "cVRIUJdTW5-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Preserve (When this ally dies, put it into your material deck preserved. As you materialize, you may instead return a preserved card to its owner's hand.)",
          keyword: {
            name: "preserve",
          },
        },
        {
          id: "cVRIUJdTW5-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever Meadowbloom Dryad or another ally enters the field under your control, put a buff counter on target ally.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
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

export default meadowbloomDryad;
