import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pendantOfApsisRestraint: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FuPPK2ixjq",
  slug: "pendant-of-apsis-restraint",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FuPPK2ixjq:face:default",
      catalogId: "FuPPK2ixjq",
      name: "Pendant of Apsis Restraint",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Ultimate cards cost (3) more to activate.",
      abilities: [
        {
          id: "FuPPK2ixjq-a1",
          kind: "static",
          staticKind: "effects",
          text: "Ultimate cards cost (3) more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              filter: {
                kind: "subtype",
                oneOf: ["ULTIMATE"],
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default pendantOfApsisRestraint;
