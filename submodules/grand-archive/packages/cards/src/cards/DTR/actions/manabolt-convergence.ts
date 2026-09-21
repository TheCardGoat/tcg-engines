import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manaboltConvergence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "smse0zjalx",
  slug: "manabolt-convergence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "smse0zjalx:face:default",
      catalogId: "smse0zjalx",
      name: "Manabolt Convergence",
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
      elements: ["NORM"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Until end of turn, you may activate target Aethercharge card in your graveyard. (You still pay its costs.)\n\nYou may load Manabolt Convergence into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "smse0zjalx-a1",
          kind: "card-resolution",
          text: "Until end of turn, you may activate target Aethercharge card in your graveyard. (You still pay its costs.)",
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
                filter: {
                  kind: "subtype",
                  oneOf: ["AETHERCHARGE"],
                },
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            affectedSet: "locked",
            fromZone: "graveyard",
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "smse0zjalx-a2",
          kind: "card-resolution",
          text: "You may load Manabolt Convergence into an Aetherwing weapon you control.",
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

export default manaboltConvergence;
