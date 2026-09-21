import { grandArchiveActionSummary, useGrandArchiveCardActions } from "./GrandArchiveCardActions";
import { useEffect, type ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import {
  DefaultSimulatorEntityVisual,
  SimulatorEntityVisualProvider,
  type SimulatorEntityVisualProps,
} from "@tcg/simulator-ui";
import "./grand-archive.css";
import { GrandArchiveCardPreviewProvider } from "./GrandArchiveCardPreview";

export function GrandArchiveSimulatorProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("ga-simulator-active");
    return () => document.body.classList.remove("ga-simulator-active");
  }, []);

  return (
    <MantineProvider defaultColorScheme="dark">
      <SimulatorEntityVisualProvider renderer={GrandArchiveHandVisual}>
        <GrandArchiveCardPreviewProvider>
          <div className="ga-simulator-root" data-game="grand-archive">
            {children}
          </div>
        </GrandArchiveCardPreviewProvider>
      </SimulatorEntityVisualProvider>
    </MantineProvider>
  );
}

/** Preserve the shared hand geometry and its single delegated card button. */
function GrandArchiveHandVisual(props: SimulatorEntityVisualProps) {
  const actions = useGrandArchiveCardActions(props.entity.id);
  const actionable =
    props.entity.face === "public" &&
    actions.length > 0 &&
    (!props.presentation || props.presentation === "default");
  return (
    <div className="ga-hand-card-visual" data-actionable={actionable || undefined}>
      <DefaultSimulatorEntityVisual {...props} />
      {actionable ? (
        <span className="ga-hand-card-visual__actions" aria-hidden="true">
          {grandArchiveActionSummary(actions)}
        </span>
      ) : null}
    </div>
  );
}
