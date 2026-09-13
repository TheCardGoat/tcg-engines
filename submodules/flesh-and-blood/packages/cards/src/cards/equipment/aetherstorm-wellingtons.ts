import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aetherstorm-wellingtons.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

/** Model notes (hand-authored): Arcane Barrier 2 on Wizard legs. */
export const aetherstormWellingtons = defineCard(
  fabCardIdentitiesByCanonicalId["hTQgmpCHwLFgQnFbgf6tC"],
  {
    keywords: [arcaneBarrier(2)],
  },
);
