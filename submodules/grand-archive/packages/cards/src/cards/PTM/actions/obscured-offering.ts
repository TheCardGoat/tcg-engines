import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const obscuredOffering: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "S3ODMQ0V0o",
  slug: "obscured-offering",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "S3ODMQ0V0o:face:default",
      catalogId: "S3ODMQ0V0o",
      name: "Obscured Offering",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, banish two cards from your material deck. \n\nTarget regalia gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
      abilities: [
        {
          id: "S3ODMQ0V0o-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, banish two cards from your material deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "S3ODMQ0V0o-a2",
          kind: "card-resolution",
          text: "Target regalia gains spellshroud until end of turn. (Objects with spellshroud can’t be targeted by Spells.)",
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
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
          ],
          effect: {
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
                name: "spellshroud",
              },
            },
          },
        },
      ],
    },
  },
};

export default obscuredOffering;
