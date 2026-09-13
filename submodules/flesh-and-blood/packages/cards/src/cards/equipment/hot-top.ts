import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hot-top.generated.ts";

export const hotTop = defineCard(fabCardIdentitiesByCanonicalId["Bpf8fG8p9BdL6Bgmk7K7F"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsWeaponAttackMayPutAttackReactionFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          defendedAttack: { typeBox: { types: ["Weapon"] } },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: { typeBox: { types: ["Attack Reaction"] } },
              count: 1,
            },
            to: { zone: "deck", position: "top" },
          },
        },
      },
    },
  },
});
