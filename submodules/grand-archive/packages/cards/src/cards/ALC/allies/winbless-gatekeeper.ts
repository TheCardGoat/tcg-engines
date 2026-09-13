import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessGatekeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y5ttkk39i1",
  slug: "winbless-gatekeeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y5ttkk39i1:face:default",
      catalogId: "y5ttkk39i1",
      name: "Winbless Gatekeeper",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "Taunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)\n\nOn Enter: You may pay (2). When you do, put a buff counter on target Guardian ally you control.",
      abilities: [
        {
          id: "y5ttkk39i1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this ally must be targeted before other units you control during your opponents' attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "y5ttkk39i1-a2",
          kind: "triggered",
          text: "On Enter: You may pay (2). When you do, put a buff counter on target Guardian ally you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "reflexive",
              action: {
                kind: "pay",
                player: "controller",
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
              },
              consequence: {
                kind: "add-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "buff",
                amount: 1,
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
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["GUARDIAN"],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default winblessGatekeeper;
