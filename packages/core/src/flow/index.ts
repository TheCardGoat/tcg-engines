/**
 * Task 9: XState Flow Manager
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

export { FlowManager } from "./flow-manager";
