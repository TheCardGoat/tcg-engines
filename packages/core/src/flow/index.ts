/**
 * Task 9: Flow Manager
 *
 * Flow orchestration system for turn/phase/segment management.
 *
 * Key features:
 * - Rich FlowContext API (not just state)
 * - Programmatic and automatic transitions
 * - Configurable progression logic
 * - Hierarchical states (turn → phases → segments)
 * - Lifecycle hooks at all levels
 *
 * Note: Originally planned to use XState, but a simple state machine
 * proved more appropriate. No external dependencies needed.
 *
 * @module flow
 */

export type {
  EndCondition,
  FlowContext,
  FlowDefinition,
  LifecycleHook,
  PhaseDefinition,
  SegmentDefinition,
  TurnDefinition,
} from "./flow-definition";

export {
  FlowManager,
  type FlowManagerOptions,
  type FlowStateSnapshot,
  type SerializedFlowState,
} from "./flow-manager";
