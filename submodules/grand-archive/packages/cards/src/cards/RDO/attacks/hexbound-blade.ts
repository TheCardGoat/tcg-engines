import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hexboundBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RfQhLQ539Z",
  slug: "hexbound-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RfQhLQ539Z:face:default",
      catalogId: "RfQhLQ539Z",
      name: "Hexbound Blade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "CURSE", "DAGGER"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
      },
      rulesText:
        "As long as you have agility, Hexbound Blade gets +4POWER.\n\n[Tristan Bonus] On Hit: Put Hexbound Blade on the bottom of target champion's lineage.\n\nInherited Effect  — If damage would be dealt to this unit by an umbra element source, that source deals that much damage plus 1 to this unit instead.",
      abilities: [
        {
          id: "RfQhLQ539Z-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have agility, Hexbound Blade gets +4POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-state",
                player: "controller",
                state: "agility",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 4,
              },
            },
          ],
        },
        {
          id: "RfQhLQ539Z-a2",
          kind: "triggered",
          text: "[Tristan Bonus] On Hit: Put Hexbound Blade on the bottom of target champion's lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-champion",
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "bound",
                binding: "target-champion",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
        {
          id: "RfQhLQ539Z-a3",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect  — If damage would be dealt to this unit by an umbra element source, that source deals that much damage plus 1 to this unit instead.",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "element",
                    oneOf: ["UMBRA"],
                  },
                },
                recipient: {
                  kind: "ability-bearer",
                },
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: 1,
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

export default hexboundBlade;
