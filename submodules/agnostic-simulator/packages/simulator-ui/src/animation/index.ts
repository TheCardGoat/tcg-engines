export {
  createSimulatorAnimationScope,
  type SimulatorAnimationActions,
  type SimulatorAnimationProjection,
  type SimulatorAnimationRootProps,
  type SimulatorAnimationStatus,
  type SimulatorTransitionOutcome,
  type SimulatorTransitionSettledEvent,
  type SimulatorCommandGate,
} from "./provider/createSimulatorAnimationScope";
export {
  SimulatorEntityVisual,
  SimulatorEntityVisualProvider,
  DefaultSimulatorEntityVisual,
} from "./components/SimulatorEntityVisual";
export type {
  SimulatorEntityVisualProps,
  SimulatorValueDeltaVisualProps,
} from "./provider/contexts";
export { AnimationInteractionBoundary } from "./components/AnimationInteractionBoundary";
export { AnimatedEntityCollection } from "./components/AnimatedEntityCollection";
export { AnimatedEntitySlot, type AnimatedEntitySlotProps } from "./components/AnimatedEntitySlot";
export { AnimatedEntityListItem, AnimatedEntityNode } from "./components/AnimatedEntityNode";
export { AnimatedZoneSlot, type AnimatedZoneSlotProps } from "./components/AnimatedZoneSlot";
export { AnimationAnchor } from "./components/AnimationAnchor";
export { useAnimationNode } from "./hooks/useAnimationNode";
export { simulatorBoardCenterAnimationRef } from "./overlays/overlay-utils";
export {
  createAnimationNodeRegistry,
  type AnimationNodeRecord,
  type AnimationNodeRegistry,
} from "./lib/node-registry";
