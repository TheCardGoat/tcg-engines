import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const decompose: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3JWk1jxX5u",
  slug: "decompose",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3JWk1jxX5u:face:default",
      catalogId: "3JWk1jxX5u",
      name: "Decompose",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice an ally.\n\nGather X times, where X is the sacrificed ally’s life stat. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "3JWk1jxX5u-a1",
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
          id: "3JWk1jxX5u-a2",
          kind: "card-resolution",
          text: "Gather X times, where X is the sacrificed ally’s life stat. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "property",
                subject: {
                  kind: "bound",
                  binding: "sacrificed-object",
                },
                property: "life",
                basis: "last-known",
                missing: "zero",
              },
            },
          ],
          effect: {
            kind: "repeat",
            count: {
              kind: "property",
              subject: {
                kind: "bound",
                binding: "sacrificed-object",
              },
              property: "life",
              basis: "last-known",
              missing: "zero",
            },
            effect: {
              kind: "keyword-action",
              action: "gather",
              player: "controller",
            },
          },
        },
      ],
    },
  },
};

export default decompose;
