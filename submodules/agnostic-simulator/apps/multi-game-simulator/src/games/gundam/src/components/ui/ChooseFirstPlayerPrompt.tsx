import { m } from "../../lib/i18n/messages.ts";
import { GundamChoiceModal } from "./GundamChoiceModal.tsx";

export interface ChooseFirstPlayerPromptProps {
  readonly onChooseSelf: () => void;
  readonly onChooseOpponent: () => void;
}

/**
 * UI for Gundam setup milestone 1 — rules 6-2-1-4 "choose first player".
 *
 * Surfaces a labelled region (screen readers + E2E tests find it by role)
 * with two explicit actions. Engine-side, only the active player may submit
 * `chooseFirstPlayer`; the fixture always seats the viewer as that active
 * player, so both actions are safe to render unconditionally here.
 */
export function ChooseFirstPlayerPrompt({
  onChooseSelf,
  onChooseOpponent,
}: ChooseFirstPlayerPromptProps) {
  return (
    <GundamChoiceModal
      title={m["sim.setup.chooseFirstPlayer.title"]()}
      description={m["sim.setup.chooseFirstPlayer.hint"]()}
      options={[
        {
          id: "self",
          label: m["sim.setup.chooseFirstPlayer.selfAction"](),
        },
        {
          id: "opponent",
          label: m["sim.setup.chooseFirstPlayer.opponentAction"](),
        },
      ]}
      onSelect={(optionId) => {
        if (optionId === "self") {
          onChooseSelf();
          return;
        }

        if (optionId === "opponent") {
          onChooseOpponent();
          return;
        }

        console.warn("Unexpected choose-first-player option id:", optionId);
      }}
    />
  );
}
