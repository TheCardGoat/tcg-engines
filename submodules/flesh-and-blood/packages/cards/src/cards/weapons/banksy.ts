import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/banksy.generated.ts";

export const banksy = defineCard(fabCardIdentitiesByCanonicalId["LJrMwbT9tW99BNDwBKNfr"], {
  keywords: [
    {
      name: "specialization",
      hero: "Maxx",
    },
  ],
  abilities: {
    oncePerTurnActionResourceAttackActivateAbilityOnlyCrankedTurn: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      condition: { type: "performed-this-turn", event: "crank", player: "controller" },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    hitsPutSteamCounterItemCrank: {
      kind: "static",
      staticKind: "triggered",
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
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Item"],
              },
              hasKeyword: "crank",
            },
            count: 1,
          },
        },
      },
    },
  },
});
