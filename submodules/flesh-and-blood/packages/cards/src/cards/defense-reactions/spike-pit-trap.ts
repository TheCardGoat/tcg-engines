import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/spike-pit-trap.generated.ts";
import { legendary, specialization } from "../shared/keywords.ts";

export const spikePitTrap = definePitchFamily(fabPitchFamilies["spike-pit-trap"], {
  keywords: [legendary, specialization("Riptide")],
  abilities: () => ({
    millThenLoseLifeOnAttackerReaction: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "has-status",
          status: "attack-reaction-played-or-activated-this-chain-link",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attacking-hero",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "graveyard",
              },
            },
            {
              type: "lose-life",
              amount: {
                type: "count",
                what: "cards-in-zone",
                zone: "graveyard",
                player: "attacking-hero",
                filter: {
                  name: "same-as-milled-this-way",
                },
              },
              target: {
                selector: "attack-target",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: spikePitTrapBlue } = spikePitTrap.cards;
