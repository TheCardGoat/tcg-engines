import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reluctantBreath: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xfheZavYZm",
  slug: "reluctant-breath",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xfheZavYZm:face:default",
      catalogId: "xfheZavYZm",
      name: "Reluctant Breath",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ARTIFACT"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nREST, Banish Reluctant Breath: As a Spell, return target ally you don't control to its owner's memory. Activate this ability only if an opponent controls at least two more allies than you.",
      abilities: [
        {
          id: "xfheZavYZm-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "xfheZavYZm-a2",
          kind: "activated",
          text: "REST, Banish Reluctant Breath: As a Spell, return target ally you don't control to its owner's memory. Activate this ability only if an opponent controls at least two more allies than you.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
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
                player: "opponent",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["field"],
              player: "each-opponent",
              filter: {
                kind: "type",
                oneOf: ["ALLY"],
              },
            },
          },
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "move",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              destination: {
                zone: "memory",
              },
            },
          },
        },
      ],
    },
  },
};

export default reluctantBreath;
