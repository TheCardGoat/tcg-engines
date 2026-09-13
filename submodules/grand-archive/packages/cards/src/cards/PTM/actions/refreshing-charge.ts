import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refreshingCharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "TZxw1pPmHD",
  slug: "refreshing-charge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "TZxw1pPmHD:face:default",
      catalogId: "TZxw1pPmHD",
      name: "Refreshing Charge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Recover 3. Then you may load Refreshing Charge into an Aetherwing weapon you control.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "TZxw1pPmHD-a1",
          kind: "card-resolution",
          text: "Recover 3. Then you may load Refreshing Charge into an Aetherwing weapon you control.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
              {
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
            ],
          },
        },
        {
          id: "TZxw1pPmHD-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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
          ],
        },
      ],
    },
  },
};

export default refreshingCharge;
