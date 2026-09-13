import { dominate } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/victor-goldmane-match-fixer.generated.ts";

export const victorGoldmaneMatchFixer = defineCard(
  fabCardIdentitiesByCanonicalId["jHHWGcnRpjzF8NMMKmdfF"],
  {
    abilities: {
      instantTapChooseOpponentFirstRevealNextClashTurnGets1PowerWinClashCreateGoldToken: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap-self",
        },
        // 1v1 product: choose-opponent auto-binds the sole opposing seat
        // (opponentOf — no chooser UI). Then: first-reveal +1{p} continuous +
        // delayed-trigger when they win a clash → create Gold.
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-opponent",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              // Subject is latched via appliesTo when a matching revealed card
              // is observed; self is the registration host (hero).
              target: {
                selector: "self",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  hasStatus: "revealed",
                },
                ordinal: 1,
              },
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "clash-win",
                  actor: {
                    kind: "player",
                    player: "opponent",
                  },
                  observes: {
                    kind: "none",
                  },
                },
              },
              policy: {
                kind: "windowed",
                duration: "until-opponent-next-clash-resolves",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "create-token",
                  token: "gold",
                  controller: "controller",
                },
              },
            },
          ],
        },
      },
      wheneverAttackDestroy3GoldAttackGets3PowerDominate: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
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
              // Gold tokens are Generic/Token/Item named "Gold" (not types:["Gold"]).
              // Match gravy/puffin/scurv destroy costs — name filter is the
              // production path for "destroy a Gold you control".
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["permanent"],
                filter: {
                  name: "Gold",
                },
                count: 3,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 3,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
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
                },
              ],
            },
          },
        },
      },
    },
  },
);
