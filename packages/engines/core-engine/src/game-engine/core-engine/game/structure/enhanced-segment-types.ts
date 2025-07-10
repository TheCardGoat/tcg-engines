/**
 * Enhanced segment types for Lorcana implementation
 * This extends the existing segment system to support flow configuration integration
 */
import type { FlowConfiguration } from "../../flow/flow-manager";
import type { CoreEngineState } from "../../game-configuration";

/**
 * Enhanced game segment interface that supports flow integration
 */
export interface GameSegment {
  id: string;
  name: string;
  start?: boolean;
  end?: boolean;
  next?: string;
  flow?: FlowConfiguration;
  onBegin?: (state: CoreEngineState) => CoreEngineState;
  onEnd?: (state: CoreEngineState) => CoreEngineState;
  endIf?: (state: CoreEngineState) => boolean;
}

/**
 * Collection of segments for a game
 */
export interface GameSegmentMap {
  [segmentId: string]: GameSegment;
}

/**
 * Segment transition result
 */
export interface SegmentTransition {
  from: string;
  to: string | null;
  reason: "manual" | "condition" | "automatic";
}

/**
 * Enhanced segment configuration that extends the base segment system
 */
export interface EnhancedSegmentConfig extends GameSegment {
  // Additional metadata for enhanced functionality
  priority?: number;
  description?: string;
  conditions?: {
    enter?: (state: CoreEngineState) => boolean;
    exit?: (state: CoreEngineState) => boolean;
  };
}
