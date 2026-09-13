import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dreamFairy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UVAb8CmjtL",
  slug: "dream-fairy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UVAb8CmjtL:face:default",
      catalogId: "UVAb8CmjtL",
      name: "Dream Fairy",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FAIRY"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\nOn Enter: Return target ally you don't control to its owner's memory. Opponents can't activate cards with that ally's name as long as you control Dream Fairy.",
      abilities: [
        {
          id: "UVAb8CmjtL-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "UVAb8CmjtL-a2",
          kind: "triggered",
          text: "On Enter: Return target ally you don't control to its owner's memory. Opponents can't activate cards with that ally's name as long as you control Dream Fairy.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-ally",
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
                player: "opponent",
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
                kind: "track-characteristic",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                characteristic: "card-name",
                trackAs: "returned-ally-name",
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "rule-modification",
                mode: "forbid",
                action: "activate",
                subject: {
                  kind: "player",
                  player: "each-opponent",
                },
                filter: {
                  kind: "matches-tracked-characteristic",
                  key: "returned-ally-name",
                  characteristic: "card-name",
                },
                duration: {
                  kind: "while-source-on-field",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default dreamFairy;
