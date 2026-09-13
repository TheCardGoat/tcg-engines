import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const corhaziInfiltrator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VAFTR5taNG",
  slug: "corhazi-infiltrator",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VAFTR5taNG:face:default",
      catalogId: "VAFTR5taNG",
      name: "Corhazi Infiltrator",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["LUXEM"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\n[Class Bonus] [Element Bonus] Whenever you reveal Corhazi Infiltrator from your memory, you may put a card named Corhazi Infiltrator from your memory onto the field.",
      abilities: [
        {
          id: "VAFTR5taNG-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "VAFTR5taNG-a2",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal Corhazi Infiltrator from your memory, you may put a card named Corhazi Infiltrator from your memory onto the field.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "memory",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "deployed-corhazi-infiltrator",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "name",
                    value: "Corhazi Infiltrator",
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "deployed-corhazi-infiltrator",
                },
                from: "memory",
                destination: {
                  zone: "field",
                },
              },
            },
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default corhaziInfiltrator;
