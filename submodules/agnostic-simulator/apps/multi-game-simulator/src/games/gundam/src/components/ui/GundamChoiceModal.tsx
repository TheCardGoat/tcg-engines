import { ChoiceModal } from "@tcg/simulator-ui";
import type { InteractionOption } from "@tcg/simulator-contract";

const GUNDAM_CHOICE_MODAL_CLASS = [
  "[&_.choice-modal-backdrop]:bg-transparent",
  "[&_.choice-modal-backdrop]:backdrop-blur-none",
  "[&_.choice-modal-backdrop]:pointer-events-none",
  "[&_.choice-modal-backdrop]:z-[290]",
  "[&_.choice-modal]:bg-[linear-gradient(180deg,#ffffff,#fbfcfe)]",
  "[&_.choice-modal]:border-hud-border-hot",
  "[&_.choice-modal]:pointer-events-auto",
  "[&_.choice-modal]:!text-hud-text",
  "[&_.choice-modal]:[box-shadow:0_0_40px_rgba(45,107,255,.25),0_8px_30px_rgba(0,0,0,.55)]",
  "[&_.choice-modal-title]:text-hud-accent-hot",
  "[&_.choice-modal-description]:text-hud-text-muted",
  "[&_.choice-modal-option]:border-hud-border",
  "[&_.choice-modal-option]:bg-transparent",
  "[&_.choice-modal-option]:text-center",
  "[&_.choice-modal-option]:!text-hud-text",
  "[&_.choice-modal-option:first-child]:border-hud-accent-hot",
  "[&_.choice-modal-option:first-child]:bg-[linear-gradient(180deg,var(--color-hud-accent),var(--color-hud-accent-deep))]",
  "[&_.choice-modal-option:first-child]:!text-white",
].join(" ");

export interface GundamChoiceModalProps {
  readonly title: string;
  readonly description?: string;
  readonly options: readonly InteractionOption[];
  readonly onSelect: (optionId: string) => void;
}

export function GundamChoiceModal({
  title,
  description,
  options,
  onSelect,
}: GundamChoiceModalProps) {
  return (
    <section className={GUNDAM_CHOICE_MODAL_CLASS}>
      <ChoiceModal
        open
        title={title}
        description={description}
        options={options}
        onSelect={onSelect}
      />
    </section>
  );
}
