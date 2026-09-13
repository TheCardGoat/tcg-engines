import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const materializeTheSoul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1wqqUKG6pD",
  slug: "materialize-the-soul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1wqqUKG6pD:face:default",
      catalogId: "1wqqUKG6pD",
      name: "Materialize the Soul",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["CRUX"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Merlin Bonus] [Sheen 15+] This card costs 3 less to activate.\n\n[Merlin Bonus] Your champion becomes all class types of target opponent's champion in addition to their other types. Then look at that opponent's material deck. You may materialize a regalia card from among them, ignoring its elemental requirements. (The class changing effect lasts indefinitely.)",
      abilities: [
        {
          id: "1wqqUKG6pD-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Merlin Bonus] [Sheen 15+] This card costs 3 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 15,
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "1wqqUKG6pD-a2",
          kind: "card-resolution",
          text: "[Merlin Bonus] Your champion becomes all class types of target opponent's champion in addition to their other types. Then look at that opponent's material deck. You may materialize a regalia card from among them, ignoring its elemental requirements. (The class changing effect lasts indefinitely.)",
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
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "copy-characteristic",
                  from: {
                    kind: "champion",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                  characteristic: "class",
                },
              },
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-material-deck",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "all",
                  },
                  candidates: {
                    kind: "card",
                    zones: ["material-deck"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "regalia-card",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "card",
                      binding: "looked-material-deck",
                      filter: {
                        kind: "supertype",
                        oneOf: ["REGALIA"],
                      },
                    },
                  },
                  effect: {
                    kind: "materialize-card",
                    subject: {
                      kind: "bound",
                      binding: "regalia-card",
                    },
                    payCosts: true,
                    ignoreElementRequirements: true,
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default materializeTheSoul;
