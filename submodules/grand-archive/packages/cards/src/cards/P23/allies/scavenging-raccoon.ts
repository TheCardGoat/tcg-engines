import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scavengingRaccoon: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fdt8ptrz1b",
  slug: "scavenging-raccoon",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fdt8ptrz1b:face:default",
      catalogId: "fdt8ptrz1b",
      name: "Scavenging Raccoon",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "RACCOON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "On Enter: Banish up to two target cards from a single graveyard.",
      abilities: [
        {
          id: "fdt8ptrz1b-a1",
          kind: "triggered",
          text: "On Enter: Banish up to two target cards from a single graveyard.",
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
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              candidates: {
                kind: "card",
                zones: ["hand"],
                relationship: "zone-of",
                player: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default scavengingRaccoon;
