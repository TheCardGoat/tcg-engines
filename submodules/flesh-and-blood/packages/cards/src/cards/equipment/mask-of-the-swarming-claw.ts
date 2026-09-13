import { arcaneBarrier, spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mask-of-the-swarming-claw.generated.ts";

/** Live Spellvoid X amount — chain links controlled by the equipment's controller. */
const spellvoidXChainLinks = {
  type: "count",
  what: "chain-links",
  player: "controller",
} as const;

export const maskOfTheSwarmingClaw = defineCard(
  fabCardIdentitiesByCanonicalId["g87mMPgfPPFTprgJCCkrQ"],
  {
    keywords: [
      arcaneBarrier(1),
      // Printed Spellvoid X — amount is a live count, not a type-"x" placeholder.
      // Replacement candidates evaluate FabAmount at arcane-damage time.
      spellvoid(spellvoidXChainLinks),
    ],
    abilities: {
      spellvoidXWhereXIsNumberChainLinksControl: {
        kind: "static",
        staticKind: "continuous",
        // Continuous re-grants the same dynamic keyword so layered continuous
        // evaluation can overwrite a stale placeholder and keep the amount live.
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "spellvoid",
              value: spellvoidXChainLinks,
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  },
);
