import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const equinoxHour: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UE6g95C1nZ",
  slug: "equinox-hour",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UE6g95C1nZ:face:default",
      catalogId: "UE6g95C1nZ",
      name: "Equinox Hour",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Equinox Hour: Draw a card. Then target opponent may materialize a card from their material deck. (That opponent still pays for its costs.)",
      abilities: [
        {
          id: "UE6g95C1nZ-a1",
          kind: "activated",
          text: "Banish Equinox Hour: Draw a card. Then target opponent may materialize a card from their material deck. (That opponent still pays for its costs.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "choose",
                selection: {
                  id: "chosen-material-card",
                  kind: "choice",
                  declared: "resolution",
                  chooser: {
                    binding: "target-opponent",
                  },
                  count: {
                    kind: "up-to",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
                effect: {
                  kind: "materialize-card",
                  subject: {
                    kind: "bound",
                    binding: "chosen-material-card",
                  },
                  materializer: {
                    binding: "target-opponent",
                  },
                  payCosts: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default equinoxHour;
