import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lostProvidence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DNbIpzVgde",
  slug: "lost-providence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DNbIpzVgde:face:default",
      catalogId: "DNbIpzVgde",
      name: "Lost Providence",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "ARTIFACT"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {},
      rulesText:
        "Divine Relic, Hindered\n\nYou may activate this card from your material deck. If you do it enters the field ephemeral.\n\nREST, Banish Lost Providence: Draw a card.\n",
      abilities: [
        {
          id: "DNbIpzVgde-a1",
          kind: "keyword-group",
          text: "Divine Relic, Hindered",
          keywords: [
            {
              name: "divine-relic",
            },
            {
              name: "hindered",
            },
          ],
        },
        {
          id: "DNbIpzVgde-a2",
          kind: "static",
          staticKind: "effects",
          text: "You may activate this card from your material deck. If you do it enters the field ephemeral.",
          functionalZones: ["material-deck"],
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              activationResult: {
                entryState: {
                  state: "ephemeral",
                  value: true,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "DNbIpzVgde-a3",
          kind: "activated",
          text: "REST, Banish Lost Providence: Draw a card.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default lostProvidence;
