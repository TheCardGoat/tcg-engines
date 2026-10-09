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
  /** Dense phone presentation for the prompt banner and choice sheets. */
  surface?: "desktop" | "mobile";
}

export function CyberpunkInteractionPanel({
  fixture,
  onSubmitInteraction,
  promptPlacement = "player",
  onTogglePromptPlacement,
  surface = "desktop",
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
            surface={surface}
            showActionPrompt
            promptPlacement={promptPlacement}
            onTogglePromptPlacement={onTogglePromptPlacement}
          />
          <ChoiceModal side="player" surface={surface} />
          <ChoiceModal side="opponent" surface={surface} />
        </>
      )}
      {/* See ./Prompt/index.ts for the full prompt surface map. This generic
          InteractionPanel is hidden adapter/debug output, not the visible
          Cyberpunk player prompt above. */}
      <div className={classes.testOnlyInteractionPanel}>
        <InteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
      </div>
    </div>
  );
}
