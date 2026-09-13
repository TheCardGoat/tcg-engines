import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { ComponentType, ReactNode } from "react";
import { CardFace } from "../../components/CardFace";
import { projectSimulatorEntityForFace } from "../../components/entity-visibility";
import {
  SimulatorEntityVisualContext,
  useOptionalAnimationRuntime,
  type SimulatorEntityVisualProps,
} from "../provider/contexts";
import { useContext } from "react";

export function SimulatorEntityVisual({
  entity,
  density,
  className,
  presentation,
}: SimulatorEntityVisualProps) {
  const registeredRenderer = useContext(SimulatorEntityVisualContext);
  const runtimeRenderer = useOptionalAnimationRuntime()?.entityRenderer;
  const Renderer = registeredRenderer ?? runtimeRenderer;
  if (!Renderer) {
    throw new Error(
      "SimulatorEntityVisual must be rendered inside SimulatorEntityVisualProvider or a simulator animation scope.",
    );
  }
  const projected = projectSimulatorEntityForFace(entity);
  return (
    <Renderer
      entity={projected}
      density={density}
      className={className}
      presentation={presentation}
    />
  );
}

export function SimulatorEntityVisualProvider({
  renderer,
  children,
}: {
  readonly renderer: ComponentType<SimulatorEntityVisualProps>;
  readonly children: ReactNode;
}) {
  return (
    <SimulatorEntityVisualContext.Provider value={renderer}>
      {children}
    </SimulatorEntityVisualContext.Provider>
  );
}

export function DefaultSimulatorEntityVisual({
  entity,
  density,
  className,
}: SimulatorEntityVisualProps) {
  return (
    <div className={className}>
      <CardFace entity={entity} density={density} as="div" />
    </div>
  );
}

export function projectEntityVisual(
  entity: SimulatorEntity,
  face: "public" | "hidden",
): SimulatorEntity {
  return projectSimulatorEntityForFace(entity, face);
}
