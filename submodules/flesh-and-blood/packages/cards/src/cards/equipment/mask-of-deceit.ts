import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-deceit.generated.ts";

export const maskOfDeceit = defineCard(fabCardIdentitiesByCanonicalId["mTf6RCrQ8NpGBBdbC6dQj"], {
  keywords: [
    {
      name: "specialization",
      hero: "Arakni",
    },
    bladeBreak,
  ],
  abilities: {
    whenDefendsBecomeRandomAgentChaosIfAttackingHero: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "conditional",
          condition: {
            type: "is-marked",
            target: {
              selector: "attacking-hero",
            },
          },
          then: {
            type: "copy",
            target: { selector: "controller" },
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                typeBox: {
                  traits: ["Agent of Chaos"],
                },
              },
              count: 1,
            },
            duration: "permanent",
            except: "base-life",
            observation: "become",
          },
          else: {
            type: "copy",
            target: { selector: "controller" },
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["inventory"],
              filter: {
                typeBox: {
                  traits: ["Agent of Chaos"],
                },
              },
              count: 1,
              random: true,
            },
            duration: "permanent",
            except: "base-life",
            observation: "become",
          },
        },
      },
    },
  },
});
