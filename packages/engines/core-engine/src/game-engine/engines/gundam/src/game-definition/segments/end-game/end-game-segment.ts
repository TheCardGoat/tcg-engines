import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment-types";
import type { GundamGameState } from "~/game-engine/engines/gundam/src/gundam-engine-types";

export const endGameSegment: SegmentConfig<GundamGameState> = {
  onBegin: ({ G }) => G,
  endIf: () => true,
  next: undefined,
  turn: {
    onBegin: ({ G }) => G,
    onEnd: ({ G }) => G,
  },
};
