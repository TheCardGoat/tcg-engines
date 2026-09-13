import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/bait.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const bait = defineCard(fabCardIdentitiesByCanonicalId.ndNkP7p6FDnNWzt7ckjPf, {
  abilities: {
    preventPlayingAndActivatingOwnedCards: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "rule-modification",
            mode: "restrict",
            action: "play",
            // Game-scope restrict; filter is cards the Bait controller owns
            // (CR 8.6.34 "You can't play or activate cards you own").
            filter: {
              and: [{ hasStatus: "owned-by-controller" }, { hasStatus: "other-than-source" }],
            },
            duration: "while-in-arena",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "activate",
            filter: {
              and: [{ hasStatus: "owned-by-controller" }, { hasStatus: "other-than-source" }],
            },
            duration: "while-in-arena",
          },
        ],
      },
    },
    attack: {
      kind: "activated",
      abilityType: "attack",
      // Printed destroy is deferred ("when the chain link resolves") — not a
      // paid cost (that would remove Bait before combat opens). Razor Ring /
      // CIN002 delayed-trigger shape.
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "attack-with",
            target: {
              selector: "self",
            },
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "chain-link-resolve",
                actor: { kind: "none" },
                observes: { kind: "source", selector: "attack" },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-chain-link",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: { selector: "self" },
              },
            },
          },
        ],
      },
    },
    empowerAndGrantGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack-reaction",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
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
            duration: "this-chain-link",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "this-chain-link",
          },
        ],
      },
    },
  },
});
