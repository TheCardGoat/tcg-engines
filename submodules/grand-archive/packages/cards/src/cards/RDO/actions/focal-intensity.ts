import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const focalIntensity: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "IM2SpTAKfp",
  slug: "focal-intensity",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "IM2SpTAKfp:face:default",
      catalogId: "IM2SpTAKfp",
      name: "Focal Intensity",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Deal 1 damage to target unit.\n\n[Merlin Bonus] You may remove two sheen counters from your Fractured Memories. If you do, put two preparation counters on your champion.",
      abilities: [
        {
          id: "IM2SpTAKfp-a1",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit.",
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
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 1,
          },
        },
        {
          id: "IM2SpTAKfp-a2",
          kind: "card-resolution",
          text: "[Merlin Bonus] You may remove two sheen counters from your Fractured Memories. If you do, put two preparation counters on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "pay",
            player: "controller",
            cost: {
              kind: "remove-counter",
              subject: {
                kind: "mastery",
                player: "controller",
                name: "Fractured Memories",
              },
              counter: {
                named: "sheen",
              },
              amount: 2,
            },
            then: {
              kind: "add-counter",
              subject: {
                kind: "champion",
                player: "controller",
              },
              counter: "preparation",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default focalIntensity;
