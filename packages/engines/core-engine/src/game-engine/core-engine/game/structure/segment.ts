import {
  processTurns,
  type TurnConfig,
} from "~/game-engine/core-engine/game/structure/turn";
import type { FnContext } from "~/game-engine/core-engine/game-configuration";
import { logger } from "~/game-engine/core-engine/utils/logger";

export interface SegmentMap<G = unknown> {
  [segmentName: string]: SegmentConfig<G>;
}

export interface SegmentConfig<G = unknown> {
  start?: boolean;
  end?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined;

  turn: TurnConfig<G>;
}

export function processSegments<G = unknown>(segmentMap: SegmentMap<G>) {
  let startingSegment = null;
  const segmentMoveMap = {};
  const segmentMoveNames = new Set<string>();

  for (const segment in segmentMap) {
    const segmentConfig = segmentMap[segment];

    if (segmentConfig.start === true) {
      if (startingSegment !== null) {
        logger.warn(
          `Multiple starting segments: ${startingSegment} and ${segment}`,
        );
      }

      startingSegment = segment;
    }

    if (segmentConfig.endIf === undefined) {
      segmentConfig.endIf = () => undefined;
    }
    if (segmentConfig.onBegin === undefined) {
      segmentConfig.onBegin = ({ G }) => G;
    }
    if (segmentConfig.onEnd === undefined) {
      segmentConfig.onEnd = ({ G }) => G;
    }

    if (typeof segmentConfig.next !== "function") {
      const { next } = segmentConfig;
      segmentConfig.next = () => next || null;
    }

    if (segmentConfig.turn !== undefined) {
      const { turnMoveMap, turnMoveNames } = processTurns({
        turn: segmentConfig.turn,
      });

      for (const moveName of Object.keys(turnMoveMap)) {
        segmentMoveMap[`${segment}.${moveName}`] = turnMoveMap[moveName];
      }

      for (const moveName of turnMoveNames) {
        segmentMoveNames.add(moveName);
      }
    }
  }

  return { startingSegment, segmentMoveMap, segmentMoveNames };
}
