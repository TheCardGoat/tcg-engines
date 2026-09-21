import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/visit-the-winner-takes-all.generated.ts";

export const visitTheWinnerTakesAll = defineCard(
  fabCardIdentitiesByCanonicalId["69MBWzRNRPKgtQhz8PbML"],
  {
    abilities: {
      grantWinnerTakesAllWager: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "grant-property",
          property: {
            kind: "ability",
            ability: {
              kind: "static",
              staticKind: "triggered",
              id: "wagerForAllGold",
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
                  type: "sequence",
                  steps: [
                    {
                      type: "create-token",
                      token: "gold",
                      creator: "token-controller",
                      controller: "each",
                    },
                    {
                      type: "wager",
                      with: {
                        selector: "attack-target",
                      },
                      prize: {
                        type: "gain-control",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "opponent",
                          zones: ["permanent"],
                          filter: {
                            name: "Gold",
                            typeBox: {
                              metatypes: ["Token"],
                            },
                          },
                          count: {
                            type: "all",
                          },
                        },
                        controller: "winner",
                      },
                    },
                  ],
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
            },
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
    },
  },
);
