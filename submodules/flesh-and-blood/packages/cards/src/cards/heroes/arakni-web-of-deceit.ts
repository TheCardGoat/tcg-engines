import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/arakni-web-of-deceit.generated.ts";

export const arakniWebOfDeceit = defineCard(
  fabCardIdentitiesByCanonicalId["qMNzBQBKDMgnGpTfGgKkP"],
  {
    abilities: {
      attacksStealthAttackingMarkedGet1PowerHitsGetsGoAgain: {
        kind: "static",
        staticKind: "continuous",
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
                declared: "at-resolution",
                player: "controller",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                  hasKeyword: "stealth",
                  hasStatus: "attacking-a-marked-hero",
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
            {
              type: "grant-property",
              property: {
                kind: "ability",
                ability: {
                  kind: "static",
                  staticKind: "triggered",
                  id: "hitsGetsGoAgain",
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
                      duration: "this-turn",
                    },
                  },
                },
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Attack"],
                  },
                  hasKeyword: "stealth",
                  hasStatus: "attacking-a-marked-hero",
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-in-arena",
            },
          ],
        },
      },
      beginningEndPhaseOpponentMarkedBecomeRandomAgentChaos: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "end-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "is-marked",
            target: {
              selector: "opponent",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "copy",
            target: { selector: "controller" },
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                typeBox: {
                  traits: ["Agent of Chaos"],
                },
              },
              count: 1,
              random: true,
            },
            duration: "permanent",
            except: "base-life",
            observation: "become",
          },
        },
      },
    },
  },
);
