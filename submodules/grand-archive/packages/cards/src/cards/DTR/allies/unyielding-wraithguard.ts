import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unyieldingWraithguard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0vjo15768g",
  slug: "unyielding-wraithguard",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0vjo15768g:face:default",
      catalogId: "0vjo15768g",
      name: "Unyielding Wraithguard",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 0,
        life: 2,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.) \n\nOn Death: Return Unyielding Wraithguard from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
      abilities: [
        {
          id: "0vjo15768g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other objects you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "0vjo15768g-a2",
          kind: "triggered",
          text: "On Death: Return Unyielding Wraithguard from your graveyard to the field. It becomes ephemeral. (If an ephemeral object would leave the field, banish it instead.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                from: "graveyard",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "source",
                },
                state: "ephemeral",
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default unyieldingWraithguard;
