import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vengefulParamour: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4vjkezn49t",
  slug: "vengeful-paramour",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4vjkezn49t:face:default",
      catalogId: "4vjkezn49t",
      name: "Vengeful Paramour",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "On Enter: As a Spell, if Vengeful Paramour is ephemeral, deal 2 damage to target champion. \n\nEphemerate — (4) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "4vjkezn49t-a1",
          kind: "triggered",
          text: "On Enter: As a Spell, if Vengeful Paramour is ephemeral, deal 2 damage to target champion.",
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "conditional",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
              },
              then: {
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
          },
        },
        {
          id: "4vjkezn49t-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (4) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 4,
            },
          },
        },
      ],
    },
  },
};

export default vengefulParamour;
