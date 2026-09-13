import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bellonasRunestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "clgolelsra",
  slug: "bellonas-runestone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "clgolelsra:face:default",
      catalogId: "clgolelsra",
      name: "Bellona's Runestone",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Bellona's Runestone: Target weapon you control gets +2 POWER until end of turn. Put a durability counter on that weapon.",
      abilities: [
        {
          id: "clgolelsra-a1",
          kind: "activated",
          text: "Banish Bellona's Runestone: Target weapon you control gets +2 POWER until end of turn. Put a durability counter on that weapon.",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
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
                  amount: 2,
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "durability",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default bellonasRunestone;
