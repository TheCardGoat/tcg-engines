import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/electryn-mindmeld.generated.ts";

export const electrynMindmeld = definePitchFamily(fabPitchFamilies["electryn-mindmeld"], {
  abilities: () => ({
    ifHasGoAgainGets1WhenAttacksHero: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-keyword",
        keyword: "go-again",
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenAttacksHeroDeal1ArcaneDamageThem",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "attack",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "source",
                      selector: "attack",
                    },
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "deal-damage",
                    damageType: "arcane",
                    amount: 1,
                    target: {
                      selector: "attack-target",
                    },
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "quickstrike",
      },
    },
    firstTimeDealsDamageHeroMayPutInstantFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  }),
});
export const { yellow: electrynMindmeldYellow } = electrynMindmeld.cards;
