import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/bravo-star-of-the-show.generated.ts";
import { dominate, goAgain } from "../shared/keywords.ts";

export const bravoStarOfTheShow = defineCard(
  fabCardIdentitiesByCanonicalId["PFJnMWQNfr6jMMzJhjB9H"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Earth", "Ice", "Lightning"],
      },
    ],
    abilities: {
      startTurnRevealEarthIceLightningHandNextAttackActionCost3GreaterPlayTurnGains2PowerDominateGoAgain:
        {
          kind: "static",
          staticKind: "triggered",
          trigger: {
            kind: "event",
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
          },
          resolution: {
            kind: "effect",
            effect: {
              type: "optional",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "reveal",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      filter: {
                        typeBox: {
                          supertypes: ["Earth"],
                        },
                      },
                      count: 1,
                    },
                  },
                  {
                    type: "reveal",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      filter: {
                        typeBox: {
                          supertypes: ["Ice"],
                        },
                      },
                      count: 1,
                    },
                  },
                  {
                    type: "reveal",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      filter: {
                        typeBox: {
                          supertypes: ["Lightning"],
                        },
                      },
                      count: 1,
                    },
                  },
                ],
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 2,
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-turn",
                    appliesTo: nextAttackActionLatch({ cost: { op: "gte", value: 3 } }),
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: dominate,
                    },
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-turn",
                    appliesTo: nextAttackActionLatch({ cost: { op: "gte", value: 3 } }),
                  },
                  {
                    type: "grant-property",
                    property: {
                      kind: "keyword",
                      keyword: goAgain,
                    },
                    target: {
                      selector: "this-attack",
                    },
                    duration: "this-turn",
                    appliesTo: nextAttackActionLatch({ cost: { op: "gte", value: 3 } }),
                  },
                ],
              },
            },
          },
        },
    },
  },
);
