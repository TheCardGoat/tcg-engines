import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const profaneBindings: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7h2k6p8fss",
  slug: "profane-bindings",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7h2k6p8fss:face:default",
      catalogId: "7h2k6p8fss",
      name: "Profane Bindings",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "SPELL", "REACTION"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Negate target card activation. Banish the card that had its activation negated this way. Put Profane Bindings on the bottom of your champion's lineage.\n\nInherited Effect — This object gets -5LIFE. (Champions have this ability as long as this card is part of its lineage.) ",
      abilities: [
        {
          id: "7h2k6p8fss-a1",
          kind: "card-resolution",
          text: "Negate target card activation. Banish the card that had its activation negated this way. Put Profane Bindings on the bottom of your champion's lineage.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "negate",
                subject: {
                  kind: "bound",
                  binding: "target-stack-item",
                },
                bindResultAs: "negated-stack-item",
              },
              {
                kind: "banish-object",
                subject: {
                  kind: "stack-source",
                  binding: "negated-stack-item",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
            ],
          },
        },
        {
          id: "7h2k6p8fss-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect — This object gets -5LIFE. (Champions have this ability as long as this card is part of its lineage.)",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "subtract",
                amount: 5,
              },
            },
          ],
        },
      ],
    },
  },
};

export default profaneBindings;
