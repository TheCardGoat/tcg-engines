import { InteractionPanel } from "@tcg/simulator-ui";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";

import { PromptBanner, ChoiceModal } from "./Prompt";
import { PaymentSelectionPrompt } from "./PaymentSelection/PaymentSelectionPrompt";
import { usePaymentSelection } from "./PaymentSelection/PaymentSelectionContext";
import { useEngine } from "../engine";
import classes from "./CyberpunkInteractionPanel.module.css";

interface CyberpunkInteractionPanelProps extends SimulatorRendererProps {
  promptPlacement?: "player" | "rival";
  onTogglePromptPlacement?: () => void;
}

export function CyberpunkInteractionPanel({
  fixture,
  onSubmitInteraction,
  promptPlacement = "player",
  onTogglePromptPlacement,
}: CyberpunkInteractionPanelProps) {
  const { humanSide } = useEngine();
  const { paymentSelectionActive } = usePaymentSelection();

  return (
    <div className={classes.root}>
      {paymentSelectionActive ? (
        <PaymentSelectionPrompt />
      ) : (
        <>
          <PromptBanner
            side={humanSide}
            compact
            showActionPrompt
            promptPlacement={promptPlacement}
            onTogglePromptPlacement={onTogglePromptPlacement}
          />
          <ChoiceModal side="player" />
          <ChoiceModal side="opponent" />
        </>
      )}
      {/* Generic interaction panel is kept in the DOM for tests/debugging but
          hidden visually; Cyberpunk uses the native PromptBanner/board-driven
          interaction flow. */}
      <div className={classes.testOnlyInteractionPanel}>
        <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
      </div>
    </div>
  );
}
