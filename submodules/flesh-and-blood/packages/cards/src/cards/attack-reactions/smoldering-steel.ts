import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/smoldering-steel.generated.ts";

export const smolderingSteel = definePitchFamily(fabPitchFamilies["smoldering-steel"], {
  abilities: () => ({
    boostAndDealDamageOnHit: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "dealDamageOnHit",
                text: "",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
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
                    damageType: "generic",
                    amount: 1,
                    target: {
                      selector: "attack-target",
                    },
                  },
                },
              },
            },
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["combat-chain"],
              filter: {
                typeBox: {
                  subtypes: ["Dagger"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
        ],
        outputBinding: "it",
      },
    },
    banishInsteadOfCreatingFrostbite: {
      kind: "static",
      staticKind: "while",
      functionalZones: ["graveyard"],
      condition: {
        type: "has-status",
        status: "in-your-graveyard",
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          creator: "any",
          occurrences: "every",
          filter: {
            name: "Frostbite",
          },
          player: "controller",
        },
        modification: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "self",
            },
          },
        },
        duration: "permanent",
      },
    },
  }),
});

export const { red: smolderingSteelRed } = smolderingSteel.cards;
