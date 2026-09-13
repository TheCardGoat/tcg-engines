import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const creepingTorment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zrplywc08c",
  slug: "creeping-torment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zrplywc08c:face:default",
      catalogId: "zrplywc08c",
      name: "Creeping Torment",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "On Enter: Put Creeping Torment on the bottom of target champion's lineage.\n\nInherited Effect: Whenever you draw your second card each turn, deal 2 unpreventable damage to this object. (Champions have this ability as long as this card is part of its lineage.) ",
      abilities: [
        {
          id: "zrplywc08c-a1",
          kind: "triggered",
          text: "On Enter: Put Creeping Torment on the bottom of target champion's lineage.",
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
          id: "zrplywc08c-a2",
          kind: "triggered",
          text: "Inherited Effect: Whenever you draw your second card each turn, deal 2 unpreventable damage to this object. (Champions have this ability as long as this card is part of its lineage.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-drawn",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
              occurrence: {
                count: 2,
                window: "this-turn",
                actorScope: "same-player",
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "ability-bearer",
            },
            amount: 2,
            preventable: false,
          },
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default creepingTorment;
