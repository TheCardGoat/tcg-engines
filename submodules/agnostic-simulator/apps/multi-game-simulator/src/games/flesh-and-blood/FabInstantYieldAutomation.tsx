import * as Popover from "@radix-ui/react-popover";
import { Check, CircleOff, SkipForward } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface FabInstantYieldAutomationState {
  readonly enabled: boolean;
  readonly disabledReason?: string;
}

interface FabInstantYieldAutomationContextValue {
  readonly states: Readonly<Record<string, FabInstantYieldAutomationState>>;
  readonly onToggle?: (instanceId: string) => void;
  readonly announce: (message: string) => void;
}

const FabInstantYieldAutomationContext =
  createContext<FabInstantYieldAutomationContextValue | null>(null);

export function FabInstantYieldAutomationProvider({
  states,
  onToggle,
  children,
}: {
  readonly states: Readonly<Record<string, FabInstantYieldAutomationState>>;
  readonly onToggle?: FabInstantYieldAutomationContextValue["onToggle"];
  readonly children: ReactNode;
}) {
  const [announcement, setAnnouncement] = useState("");
  return (
    <FabInstantYieldAutomationContext.Provider
      value={{ states, onToggle, announce: setAnnouncement }}
    >
      {children}
      <span className="fab-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </FabInstantYieldAutomationContext.Provider>
  );
}

export function FabInstantYieldAutomationControl({
  instanceId,
  cardName,
}: {
  readonly instanceId: string;
  readonly cardName: string;
}) {
  const context = useContext(FabInstantYieldAutomationContext);
  const state = context?.states[instanceId];
  const [open, setOpen] = useState(false);
  if (!context || !state) return null;

  const disabled = Boolean(state.disabledReason || !context.onToggle);
  const selectEnabled = (enabled: boolean) => {
    if (disabled || !context.onToggle || enabled === state.enabled) return;
    context.onToggle(instanceId);
    context.announce(
      enabled
        ? `Instant auto-yield enabled for ${cardName}`
        : `Instant auto-yield disabled for ${cardName}`,
    );
    setOpen(false);
  };
  const options = [
    {
      enabled: false,
      label: "Ask every priority window",
      description: "Keep this card available whenever you receive priority.",
      icon: CircleOff,
    },
    {
      enabled: true,
      label: "Auto-yield this card",
      description: "Pass only when this card's Instant ability is your only remaining action.",
      icon: SkipForward,
    },
  ] as const;
  const CurrentIcon = state.enabled ? SkipForward : CircleOff;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <span
        className="fab-trigger-automation"
        data-kind="instant-yield"
        data-enabled={state.enabled ? "true" : undefined}
        data-mode={state.enabled ? "auto-yield" : "ask"}
        data-popover-open={open ? "true" : undefined}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            className="fab-trigger-automation__button"
            aria-label={`Configure Instant auto-yield for ${cardName}. Current setting: ${
              state.enabled ? "Auto-yield this card" : "Ask every priority window"
            }`}
            aria-expanded={open}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <CurrentIcon aria-hidden="true" />
          </button>
        </Popover.Trigger>
      </span>
      <Popover.Portal>
        <Popover.Content
          className="fab-trigger-automation__popover"
          side="right"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <strong>{cardName}</strong>
          <span className="fab-trigger-automation__popover-intro">
            Choose whether this card should keep priority open for its Instant ability. Auto-yield
            never activates the ability.
          </span>
          {state.disabledReason ? (
            <span className="fab-trigger-automation__popover-notice">{state.disabledReason}</span>
          ) : null}
          <div
            className="fab-trigger-automation__options"
            role="group"
            aria-label="Instant priority behavior"
          >
            {options.map((option) => {
              const OptionIcon = option.icon;
              const selected = option.enabled === state.enabled;
              return (
                <button
                  key={option.label}
                  type="button"
                  className="fab-trigger-automation__option"
                  data-selected={selected ? "true" : undefined}
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => selectEnabled(option.enabled)}
                >
                  <OptionIcon aria-hidden="true" />
                  <span>
                    <strong>{option.label}</strong>
                    <small>{option.description}</small>
                  </span>
                  {selected ? <Check aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
          <Popover.Arrow className="fab-trigger-automation__popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
