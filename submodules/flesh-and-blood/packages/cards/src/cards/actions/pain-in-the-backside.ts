import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pain-in-the-backside.generated.ts";

export const painInTheBackside = definePitchFamily(fabPitchFamilies["pain-in-the-backside"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],
  abilities: () => ({
    hitsTargetDaggerDeals1DamageDamageDealtWayDaggerHit: {
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
          type: "sequence",
          steps: [
            {
              type: "deal-damage",
              damageType: "generic",
              amount: 1,
              target: {
                selector: "attack-target",
              },
              source: {
                selector: "object",
                declared: "on-stack",
                player: "controller",
                zones: ["weapon", "permanent", "combat-chain"],
                filter: {
                  typeBox: {
                    subtypes: ["Dagger"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-numeric",
                binding: "damage-dealt-this-way",
                comparison: { op: "gt", value: 0 },
              },
              then: {
                type: "set-status",
                status: "hit",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: painInTheBacksideRed } = painInTheBackside.cards;
