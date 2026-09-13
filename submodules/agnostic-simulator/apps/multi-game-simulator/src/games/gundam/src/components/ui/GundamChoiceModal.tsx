import { ChoiceModal } from "@tcg/simulator-ui";
import type { InteractionOption } from "@tcg/simulator-contract";

const GUNDAM_CHOICE_MODAL_CLASS = [
  "gd-choice-surface",
  "[&_.choice-modal-backdrop]:bg-transparent",
  "[&_.choice-modal-backdrop]:backdrop-blur-none",
  "[&_.choice-modal-backdrop]:pointer-events-none",
  "[&_.choice-modal-backdrop]:z-[290]",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal-backdrop]:fixed",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal-backdrop]:items-start",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal]:max-w-xl",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal>div:last-child]:grid-cols-2",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal]:max-h-[calc(100dvh-2rem)]",
  "[@media(min-width:768px)_and_(max-height:520px)]:[&_.choice-modal]:overflow-y-auto",
  "[&_.choice-modal]:bg-hud-surface-raised",
  "[&_.choice-modal]:!border-2",
  "[&_.choice-modal]:!border-hud-border-hot",
  "[&_.choice-modal]:pointer-events-auto",
  "[&_.choice-modal]:!text-hud-text",
  "[&_.choice-modal]:[box-shadow:0_8px_30px_rgba(0,0,0,.55)]",
  "[&_.choice-modal>div:last-child]:!border-hud-border",
  "[&_.choice-modal>div:last-child]:bg-hud-surface",
  "[&_.choice-modal-title]:!text-hud-text",
  "[&_.choice-modal-description]:!text-hud-text-muted",
  "[&_.choice-modal-option]:!border-2",
  "[&_.choice-modal-option]:!border-hud-border-hot",
  "[&_.choice-modal-option]:!bg-hud-surface-raised",
  "[&_.choice-modal-option]:text-center",
  "[&_.choice-modal-option]:!font-bold",
  "[&_.choice-modal-option]:!text-hud-text",
  "[&_.choice-modal-option:hover]:!border-hud-accent-hot",
  "[&_.choice-modal-option:hover]:!bg-hud-accent/20",
  "[&_.choice-modal-option:first-child]:!border-hud-accent-hot",
  "[&_.choice-modal-option:first-child]:!bg-hud-accent-deep",
  "[&_.choice-modal-option:first-child]:!text-hud-deep",
  "[&_.choice-modal-option:first-child:hover]:!bg-hud-accent",
].join(" ");

export interface GundamChoiceModalProps {
  readonly title: string;
  readonly description?: string;
  readonly options: readonly InteractionOption[];
  readonly onSelect: (optionId: string) => void;
  readonly context?: "default" | "mulligan";
}

export function GundamChoiceModal({
  title,
  description,
  options,
  onSelect,
  context = "default",
}: GundamChoiceModalProps) {
  return (
    <section
      className={`${GUNDAM_CHOICE_MODAL_CLASS} ${context === "mulligan" ? "gd-mulligan-choice" : ""}`}
    >
      <ChoiceModal
        open
        title={title}
        description={description}
        options={options}
        placement="container"
        onSelect={onSelect}
      />
    </section>
  );
}
