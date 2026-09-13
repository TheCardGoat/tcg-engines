import { crank } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/maxx-nitro.generated.ts";

export const maxxNitro = defineCard(fabCardIdentitiesByCanonicalId["z7bLz9hhPDcwmTdQGf6TK"], {
  abilities: {
    oncePerTurnActionResourceResourceCreateHyperDriverToken2SteamCountersActivateAbilityOnlyBoostedTurn:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        condition: { type: "performed-this-turn", event: "boost", player: "controller" },
        effect: {
          type: "create-token",
          token: "hyper-driver",
          controller: "controller",
          withCounters: {
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 2,
          },
        },
      },
    hyperDriversGetCrank: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: crank,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Hyper Driver",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
