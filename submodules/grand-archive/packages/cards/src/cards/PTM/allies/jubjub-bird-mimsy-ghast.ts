import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jubjubBirdMimsyGhast: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uzFmjocICd",
  slug: "jubjub-bird-mimsy-ghast",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uzFmjocICd:face:default",
      catalogId: "uzFmjocICd",
      name: "Jubjub Bird, Mimsy Ghast",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY", "SPECTER", "BEAST", "BIRD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "Stealth\n\nOn Enter: You may have another target ally you control become a copy of Jubjub Bird except its name is Drib Bujbuj.",
      abilities: [
        {
          id: "uzFmjocICd-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "uzFmjocICd-a2",
          kind: "triggered",
          text: "On Enter: You may have another target ally you control become a copy of Jubjub Bird except its name is Drib Bujbuj.",
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
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "become-copy",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              copyOf: {
                kind: "source",
              },
              exceptName: "Drib Bujbuj",
              duration: {
                kind: "permanent",
              },
            },
          },
        },
      ],
    },
  },
};

export default jubjubBirdMimsyGhast;
