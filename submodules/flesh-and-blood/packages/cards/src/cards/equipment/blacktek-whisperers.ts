import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blacktek-whisperers.generated.ts";

export const blacktekWhisperers = defineCard(
  fabCardIdentitiesByCanonicalId["HpMt88NkhFBNw7fpC6tkN"],
  {
    keywords: [battleworn],
    abilities: {
      atStartTurnMayDestroy2SilversControlIf: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "has-status",
            status: "in-your-graveyard",
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Silver",
                },
                count: 2,
              },
            },
            then: {
              type: "equip",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["inventory", "hand", "deck"],
                filter: {
                  name: "Blacktek Whisperers",
                },
                count: 1,
              },
            },
          },
        },
      },
      attackReactionDestroyBlacktekWhisperersTargetAssassinAttackAction: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "whenHitsHeroGainsGoAgain",
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
                  type: "grant-property",
                  property: {
                    kind: "keyword",
                    keyword: goAgain,
                  },
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
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
                supertypes: ["Assassin"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
