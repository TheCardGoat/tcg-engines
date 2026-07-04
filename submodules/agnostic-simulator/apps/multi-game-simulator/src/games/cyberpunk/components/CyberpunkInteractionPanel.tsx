import { InteractionPanel } from "@tcg/simulator-ui";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";

import { PromptBanner, ChoiceModal } from "./Prompt";
import { useEngine } from "../engine";
import classes from "./CyberpunkInteractionPanel.module.css";

export function CyberpunkInteractionPanel({
  fixture,
  onSubmitInteraction,
}: SimulatorRendererProps) {
  const { humanSide } = useEngine();

  return (
    <div className={classes.root}>
      <PromptBanner side={humanSide} compact showActionPrompt />
      <ChoiceModal side="player" />
      <ChoiceModal side="opponent" />
      {/* Generic interaction panel is kept in the DOM for tests/debugging but
          hidden visually; Cyberpunk uses the native PromptBanner/board-driven
          interaction flow. */}
      <div className={classes.testOnlyInteractionPanel}>
        <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
      </div>
    </div>
  );
}
