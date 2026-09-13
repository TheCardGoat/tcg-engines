import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const billChimneySweep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "s9ICPMYPNx",
  slug: "bill-chimney-sweep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "s9ICPMYPNx:face:default",
      catalogId: "s9ICPMYPNx",
      name: "Bill, Chimney Sweep",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER", "ANIMAL", "LIZARD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "On Enter: If Bill is not ephemeral, sacrifice a Specter ally.\n\n[Alice Bonus] Ephemerate — (5), Discard a card. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)\n",
      abilities: [
        {
          id: "s9ICPMYPNx-a1",
          kind: "triggered",
          text: "On Enter: If Bill is not ephemeral, sacrifice a Specter ally.",
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
            kind: "conditional",
            condition: {
              kind: "not",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
              },
            },
            then: {
              kind: "choose",
              selection: {
                id: "sacrificed-object",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
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
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPECTER"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "sacrifice",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-object",
                },
              },
            },
          },
        },
        {
          id: "s9ICPMYPNx-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (5), Discard a card. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "all",
              costs: [
                {
                  kind: "pay-reserve",
                  amount: 5,
                },
                {
                  kind: "select-and-move",
                  player: "controller",
                  from: "hand",
                  to: "graveyard",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                },
              ],
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
          ],
        },
      ],
    },
  },
};

export default billChimneySweep;
