import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const classicalOpening: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "RSf7n45fhX",
  slug: "classical-opening",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "RSf7n45fhX:face:default",
      catalogId: "RSf7n45fhX",
      name: "Classical Opening",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CHESSMAN", "COMMAND"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "Command Chessman (A Chessman ally you control performs this attack.)\n\nEphemerate — (3) ",
      abilities: [
        {
          id: "RSf7n45fhX-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Command Chessman (A Chessman ally you control performs this attack.)",
          keyword: {
            name: "command",
            subtype: "Chessman",
          },
        },
        {
          id: "RSf7n45fhX-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (3)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default classicalOpening;
