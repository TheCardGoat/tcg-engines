import type { CardActionPickerModel } from "../interactions/card-interaction";
import { useEffect, useRef } from "react";

export interface CardActionPickerProps {
  readonly model: CardActionPickerModel | null;
  readonly onChoose: (actionId: string) => void;
  readonly onClose: () => void;
}

/** Game-agnostic chooser for cards with more than one currently legal action. */
export function CardActionPicker({ model, onChoose, onClose }: CardActionPickerProps) {
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const modelEntityId = model?.entity.id;
  useEffect(() => {
    if (modelEntityId) firstActionRef.current?.focus({ preventScroll: true });
  }, [modelEntityId]);
  if (!model) return null;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-end bg-black/55 p-3 sm:place-items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        aria-label={`Actions for ${model.entity.title}`}
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-950 p-4 text-white shadow-2xl"
        data-testid="card-action-picker"
        role="dialog"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide">Choose an action</h2>
          <button
            aria-label="Close action picker"
            className="rounded-md border border-white/15 px-2 py-1 text-xs text-slate-300 hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="grid gap-2">
          {model.actions.map((action, index) => (
            <button
              className="rounded-xl border border-amber-300/35 bg-amber-300/10 px-3 py-2.5 text-left text-sm font-medium hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={action.disabledReason != null}
              key={action.id}
              ref={index === 0 ? firstActionRef : undefined}
              onClick={() => onChoose(action.id)}
              title={action.disabledReason}
              type="button"
            >
              {action.label}
              {action.disabledReason ? (
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  {action.disabledReason}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
