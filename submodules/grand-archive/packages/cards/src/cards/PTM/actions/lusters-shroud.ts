import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lustersShroud: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tizLamFGPS",
  slug: "lusters-shroud",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tizLamFGPS:face:default",
      catalogId: "tizLamFGPS",
      name: "Luster's Shroud",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next time target unit would be dealt damage this turn, prevent 3 of that damage.\n\n[Merlin Bonus] [Sheen 6+] Ephemerate — (3)",
      abilities: [
        {
          id: "tizLamFGPS-a1",
          kind: "card-resolution",
          text: "The next time target unit would be dealt damage this turn, prevent 3 of that damage.",
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
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
              amount: 3,
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "tizLamFGPS-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] [Sheen 6+] Ephemerate — (3)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 6,
              },
            },
          ],
        },
      ],
    },
  },
};

export default lustersShroud;
