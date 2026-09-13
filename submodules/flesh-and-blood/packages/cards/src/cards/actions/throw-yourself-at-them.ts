import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/throw-yourself-at-them.generated.ts";

export const throwYourselfAtThem = definePitchFamily(fabPitchFamilies["throw-yourself-at-them"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  keywords: [goAgain],

  abilities: () => ({
    createAgilityWhenAttackingHero: {
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
              type: "optional",
              effect: {
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "attack-target",
                },
                source: {
                  selector: "object",
                  declared: "on-stack",
                  zones: ["combat-chain"],
                  filter: {
                    and: [
                      {
                        typeBox: {
                          subtypes: ["Dagger"],
                        },
                      },
                    ],
                  },
                  count: 1,
                },
              },
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
            {
              type: "destroy",
              target: {
                selector: "binding",
                binding: "it",
              },
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: throwYourselfAtThemRed,
  yellow: throwYourselfAtThemYellow,
  blue: throwYourselfAtThemBlue,
} = throwYourselfAtThem.cards;
