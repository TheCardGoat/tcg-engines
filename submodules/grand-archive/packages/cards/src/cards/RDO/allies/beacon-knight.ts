import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const beaconKnight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sucwQ9or0n",
  slug: "beacon-knight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sucwQ9or0n:face:default",
      catalogId: "sucwQ9or0n",
      name: "Beacon Knight",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Vigor (At the beginning of your end phase, wake up this ally.)\n\n[Class Bonus] Whenever one or more regalia enter the field under your control, put a buff counter on Beacon Knight.",
      abilities: [
        {
          id: "sucwQ9or0n-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Vigor (At the beginning of your end phase, wake up this ally.)",
          keyword: {
            name: "vigor",
          },
        },
        {
          id: "sucwQ9or0n-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever one or more regalia enter the field under your control, put a buff counter on Beacon Knight.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default beaconKnight;
