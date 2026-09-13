import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const remnantOfWill: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "XK3NiQ5MdR",
  slug: "remnant-of-will",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "XK3NiQ5MdR:face:default",
      catalogId: "XK3NiQ5MdR",
      name: "Remnant of Will",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put two haunt counters on your Phantasmagoria and recover 4.\n\n[Alice Bonus] Ephemerate — (1) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "XK3NiQ5MdR-a1",
          kind: "card-resolution",
          text: "Put two haunt counters on your Phantasmagoria and recover 4.",
          effect: {
            kind: "add-counter",
            subject: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "name",
                  value: "Phantasmagoria and recover 4",
                },
              },
            },
            counter: {
              named: "haunt",
            },
            amount: 2,
          },
        },
        {
          id: "XK3NiQ5MdR-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Alice Bonus] Ephemerate — (1) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
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

export default remnantOfWill;
