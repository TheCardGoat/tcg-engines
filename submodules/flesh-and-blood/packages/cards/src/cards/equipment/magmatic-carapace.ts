import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/magmatic-carapace.generated.ts";

/**
 * PEN017 Magmatic Carapace — Guardian Chest d2 Guardwell.
 *
 * Printed:
 *   Whenever you play an aura, you may {t} this and pay {r}. If you do,
 *   create a Seismic Surge token.
 *   Guardwell
 *
 * Model notes (hand-authored):
 * - Play trigger: actor controller + subtypes:["Aura"].
 * - Optional pay: mixed tap-self + 1{r} (engine proposePay mixed package),
 *   then create seismic-surge (if you do — empty events when tapped/low RP).
 * - Guardwell: defend places −1{d} counters equal to printed defense.
 */
export const magmaticCarapace = defineCard(
  fabCardIdentitiesByCanonicalId["JH8mLKJQjfKTt9Nb7Whf6"],
  {
    keywords: [guardwell],
    abilities: {
      wheneverPlayAuraMayPayIfDoCreateSeismic: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "mixed",
                type: "all",
                costs: [
                  {
                    class: "effect",
                    type: "tap-self",
                  },
                  {
                    class: "asset",
                    type: "resources",
                    amount: 1,
                  },
                ],
              },
              payer: "controller",
            },
            then: {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
            },
          },
        },
      },
    },
  },
);
