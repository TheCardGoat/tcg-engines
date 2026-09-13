import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const meteoricVolley: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "10u5ldz371",
  slug: "meteoric-volley",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "10u5ldz371:face:default",
      catalogId: "10u5ldz371",
      name: "Meteoric Volley",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SPELL"],
      },
      elements: ["ASTRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Activate this card only if your champion is attacking.\n\nFor each Aethercharge card in the attacker's intent, create a copy of it in that attacker's intent.",
      abilities: [
        {
          id: "10u5ldz371-a1",
          kind: "static",
          staticKind: "effects",
          text: "Activate this card only if your champion is attacking.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "object-state",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                state: "attacking",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "10u5ldz371-a2",
          kind: "card-resolution",
          text: "For each Aethercharge card in the attacker's intent, create a copy of it in that attacker's intent.",
          effect: {
            kind: "for-each",
            collection: {
              zones: ["intent"],
              host: {
                kind: "event-attacker",
              },
              relationship: "intent-of",
              filter: {
                kind: "subtype",
                oneOf: ["AETHERCHARGE"],
              },
            },
            bindEachAs: "aethercharge-card",
            effect: {
              kind: "copy",
              subject: {
                kind: "bound",
                binding: "aethercharge-card",
              },
              copy: "object",
            },
          },
        },
      ],
    },
  },
};

export default meteoricVolley;
