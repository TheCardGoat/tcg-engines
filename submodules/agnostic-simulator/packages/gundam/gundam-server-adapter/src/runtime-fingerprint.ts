import { GUNDAM_CARDS_RUNTIME } from "@tcg/gundam-cards";
import { GUNDAM_ENGINE_RUNTIME } from "@tcg/gundam-engine";
import type { GameRuntimeFingerprint } from "@tcg/shared/game-adapter";

export const GUNDAM_RUNTIME_FINGERPRINT: GameRuntimeFingerprint = {
  game: "gundam",
  runtimeHash: `${GUNDAM_ENGINE_RUNTIME.hash}.${GUNDAM_CARDS_RUNTIME.hash}`,
  engine: {
    packageName: GUNDAM_ENGINE_RUNTIME.packageName,
    hash: GUNDAM_ENGINE_RUNTIME.hash,
    metadata: {
      moveCount: GUNDAM_ENGINE_RUNTIME.moveCount,
    },
  },
  cards: {
    packageName: GUNDAM_CARDS_RUNTIME.packageName,
    hash: GUNDAM_CARDS_RUNTIME.hash,
    metadata: {
      cardCount: GUNDAM_CARDS_RUNTIME.cardCount,
    },
  },
};
