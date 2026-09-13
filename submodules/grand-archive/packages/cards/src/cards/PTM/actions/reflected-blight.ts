import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reflectedBlight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1leLWsgBkb",
  slug: "reflected-blight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1leLWsgBkb:face:default",
      catalogId: "1leLWsgBkb",
      name: "Reflected Blight",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Return target card from your graveyard to your memory. Then put Reflected Blight on the bottom of your champion's lineage. When you do, deal 1 unpreventable damage to your champion for each Curse card in your champion’s lineage.\n\n",
      abilities: [
        {
          id: "1leLWsgBkb-a1",
          kind: "card-resolution",
          text: "Return target card from your graveyard to your memory. Then put Reflected Blight on the bottom of your champion's lineage. When you do, deal 1 unpreventable damage to your champion for each Curse card in your champion’s lineage.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-card",
                },
                from: "graveyard",
                destination: {
                  zone: "memory",
                },
              },
              {
                kind: "reflexive",
                action: {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "inner-lineage",
                    host: {
                      kind: "champion",
                      player: "controller",
                    },
                    placement: {
                      kind: "bottom",
                    },
                  },
                },
                consequence: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: {
                    kind: "count",
                    collection: {
                      zones: ["inner-lineage"],
                      player: "controller",
                      filter: {
                        kind: "subtype",
                        oneOf: ["CURSE"],
                      },
                    },
                  },
                  preventable: false,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default reflectedBlight;
