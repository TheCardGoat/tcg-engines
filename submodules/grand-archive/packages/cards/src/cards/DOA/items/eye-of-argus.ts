import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eyeOfArgus: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iiZtKTulPg",
  slug: "eye-of-argus",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iiZtKTulPg:face:default",
      catalogId: "iiZtKTulPg",
      name: "Eye of Argus",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Eye of Argus: Target ally you control gains true sight until end of turn. Draw a card. (Units with true sight can attack units with stealth.)",
      abilities: [
        {
          id: "iiZtKTulPg-a1",
          kind: "activated",
          text: "Banish Eye of Argus: Target ally you control gains true sight until end of turn. Draw a card. (Units with true sight can attack units with stealth.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "true-sight",
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default eyeOfArgus;
