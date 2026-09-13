import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kingdomsDivide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qy34r8gffr",
  slug: "kingdoms-divide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qy34r8gffr:face:default",
      catalogId: "qy34r8gffr",
      name: "Kingdom's Divide",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Choose a card name. Until the beginning of your next turn, cards with the chosen name cost 2 more to activate.\n\n[Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "qy34r8gffr-a1",
          kind: "card-resolution",
          text: "Choose a card name. Until the beginning of your next turn, cards with the chosen name cost 2 more to activate.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "choose-value",
                selection: {
                  id: "chosen-card-name",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  candidates: {
                    kind: "characteristic",
                    characteristic: "card-name",
                  },
                },
                trackAs: "chosen-card-name",
              },
              {
                kind: "rule-modification",
                mode: "modify-cost",
                action: "activate",
                filter: {
                  kind: "matches-tracked-characteristic",
                  key: "chosen-card-name",
                  characteristic: "card-name",
                },
                costKind: "reserve",
                costOperation: "add",
                amount: 2,
                duration: {
                  kind: "until-start-of-turn",
                  whose: "controller",
                },
              },
            ],
          },
        },
        {
          id: "qy34r8gffr-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Level 2+] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default kingdomsDivide;
