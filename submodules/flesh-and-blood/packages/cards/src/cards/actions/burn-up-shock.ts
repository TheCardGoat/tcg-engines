import { defineSplitLayout } from "../../authoring/layouts.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/burn-up-shock.generated.ts";

export const burnUpShock = definePitchFamily(fabPitchFamilies["burn-up-shock"], {
  layouts: {
    red: defineSplitLayout(fabCardIdentitiesByCanonicalId["RmwkmHccFCW9T8HNbmBFq"], {
      left: {
        name: "Burn Up",
        typeText: "Runeblade Action",
        types: ["Runeblade", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "go-again",
          },
          {
            name: "meld",
          },
        ],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["RmwkmHccFCW9T8HNbmBFq"].canonicalId,
          {
            dealArcaneDamageAfterNextAttackHits: {
              kind: "resolution",
              effect: {
                type: "delayed-trigger",
                trigger: {
                  kind: "event",
                  event: {
                    name: "hit",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "event-object",
                      selector: "attack",
                      relationship: {
                        kind: "any",
                      },
                      filter: {
                        typeBox: {
                          subtypes: ["Attack"],
                        },
                      },
                      bindAs: "it",
                    },
                  },
                },
                policy: {
                  kind: "windowed",
                  duration: "this-turn",
                  matching: "first",
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "deal-damage",
                    damageType: "arcane",
                    amount: 4,
                    target: {
                      selector: "attack-target",
                    },
                  },
                },
              },
            },
          },
        ),
      },
      right: {
        name: "Shock",
        typeText: "Lightning Instant",
        types: ["Lightning", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: expandSemanticAbilities(
          fabCardIdentitiesByCanonicalId["RmwkmHccFCW9T8HNbmBFq"].canonicalId,
          {
            dealOneArcaneDamage: {
              kind: "resolution",
              effect: {
                type: "deal-damage",
                damageType: "arcane",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "on-stack",
                  player: "any",
                  zones: ["hero", "permanent"],
                  count: 1,
                },
              },
            },
          },
        ),
      },
    }),
  },
});
export const { red: burnUpShockRed } = burnUpShock.cards;
