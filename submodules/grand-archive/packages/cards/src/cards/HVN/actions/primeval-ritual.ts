import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const primevalRitual: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fan41iqm8b",
  slug: "primeval-ritual",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fan41iqm8b:face:default",
      catalogId: "fan41iqm8b",
      name: "Primeval Ritual",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally. \n\nReturn target wind element card from your graveyard to your memory.",
      abilities: [
        {
          id: "fan41iqm8b-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice an ally.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "fan41iqm8b-a2",
          kind: "card-resolution",
          text: "Return target wind element card from your graveyard to your memory.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "element",
                  oneOf: ["WIND"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "memory",
            },
          },
        },
      ],
    },
  },
};

export default primevalRitual;
