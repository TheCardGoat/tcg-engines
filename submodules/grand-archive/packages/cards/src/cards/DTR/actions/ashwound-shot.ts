import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ashwoundShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v9zfscdxzn",
  slug: "ashwound-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v9zfscdxzn:face:default",
      catalogId: "v9zfscdxzn",
      name: "Ashwound Shot",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] Until end of turn, target opponent can't recover.\n\nYou may load Ashwound Shot into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "v9zfscdxzn-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Until end of turn, target opponent can't recover.",
          targets: [
            {
              id: "target-player",
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
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "recover",
            subject: {
              kind: "player",
              player: {
                binding: "target-player",
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "v9zfscdxzn-a2",
          kind: "card-resolution",
          text: "You may load Ashwound Shot into an Aetherwing weapon you control.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-weapon",
                kind: "choice",
                declared: "resolution",
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
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "chosen-weapon",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default ashwoundShot;
