import type { SegmentConfig } from "~/game-engine/core-engine/game/structure/segment";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaGameState } from "../../../lorcana-engine-types";

export const endGameSegment: SegmentConfig<LorcanaGameState> = {
  end: true,

  onBegin: ({ G }) => {
    logger.debug("End Game Segment: onBegin called");
    return G;
  },

  turn: {},
};
