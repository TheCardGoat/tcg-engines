import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloodseekerMagus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3zvDCFRaoH",
  slug: "bloodseeker-magus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3zvDCFRaoH:face:default",
      catalogId: "3zvDCFRaoH",
      name: "Bloodseeker Magus",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "On Enter: Deal 3 unpreventable damage to your champion.\n\n[Damage 20+]  Ephemerate — (1) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "3zvDCFRaoH-a1",
          kind: "triggered",
          text: "On Enter: Deal 3 unpreventable damage to your champion.",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "champion",
              player: "controller",
            },
            amount: 3,
            preventable: false,
          },
        },
        {
          id: "3zvDCFRaoH-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Damage 20+]  Ephemerate — (1) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 1,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default bloodseekerMagus;
