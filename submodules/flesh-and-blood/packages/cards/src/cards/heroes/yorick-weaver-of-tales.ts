import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/yorick-weaver-of-tales.generated.ts";

export const yorickWeaverOfTales = defineCard(
  fabCardIdentitiesByCanonicalId["nrMg9kDMg9KwBPPtJLJph"],
  {
    abilities: {
      startGameAllShuffleStartingDecksTogetherAllShareSameDeckGraveyardGame: {
        kind: "static",
        staticKind: "meta",
        effect: {
          type: "start-game",
          setup: "shared-library",
          sharedLibrary: ["deck", "graveyard"],
        },
      },
    },
  },
);
