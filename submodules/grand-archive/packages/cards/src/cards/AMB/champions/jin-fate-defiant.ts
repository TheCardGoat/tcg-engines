import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jinFateDefiant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zd8l14052j",
  slug: "jin-fate-defiant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zd8l14052j:face:default",
      catalogId: "zd8l14052j",
      name: "Jin, Fate Defiant",
      lineageName: "Jin",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "Inherited Effect — Whenever Jin attacks with a Polearm weapon and/or Polearm attack card, target Horse or Human ally you control gets +1 POWER until end of turn. (Your champion has this ability as long as this card is part of its lineage.)",
      abilities: [
        {
          id: "zd8l14052j-a1",
          kind: "triggered",
          text: "Inherited Effect — Whenever Jin attacks with a Polearm weapon and/or Polearm attack card, target Horse or Human ally you control gets +1 POWER until end of turn. (Your champion has this ability as long as this card is part of its lineage.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
              using: {
                kind: "event-object",
                filter: {
                  kind: "any",
                  filters: [
                    {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["WEAPON"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POLEARM"],
                        },
                      ],
                    },
                    {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ATTACK"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POLEARM"],
                        },
                      ],
                    },
                  ],
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
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["HORSE"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["HUMAN"],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
              amount: 1,
            },
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

export default jinFateDefiant;
