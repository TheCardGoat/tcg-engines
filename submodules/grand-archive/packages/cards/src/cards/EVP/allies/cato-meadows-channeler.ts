import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const catoMeadowsChanneler: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Nn4NzegwdX",
  slug: "cato-meadows-channeler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Nn4NzegwdX:face:default",
      catalogId: "Nn4NzegwdX",
      name: "Cato, Meadow's Channeler",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Empower 2.\n\n[Class Bonus] Whenever you empower, put a buff counter on another target ally. Trigger this ability only once per turn.",
      abilities: [
        {
          id: "Nn4NzegwdX-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Empower 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
        {
          id: "Nn4NzegwdX-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you empower, put a buff counter on another target ally. Trigger this ability only once per turn.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "empower",
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
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

export default catoMeadowsChanneler;
