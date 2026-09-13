import * as Popover from "@radix-ui/react-popover";
import { Bell, BellOff, BellRing, Check } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";

export type FabOptionalTriggerAutomationMode = "ask" | "auto-accept" | "auto-decline";

interface FabOptionalTriggerAutomationContextValue {
  readonly modes: Readonly<Record<string, FabOptionalTriggerAutomationMode>>;
  readonly disabledReason?: string;
  readonly onToggle?: (
    instanceId: string,
    mode: FabOptionalTriggerAutomationMode,
    cardName: string,
    /** Canonical card id for the sticky account write-back; absent when the
     * card has no stable canonical identity. */
    canonicalId?: string,
  ) => void;
  readonly announce: (message: string) => void;
}

const FabOptionalTriggerAutomationContext =
  createContext<FabOptionalTriggerAutomationContextValue | null>(null);

export function FabOptionalTriggerAutomationProvider({
  modes,
  disabledReason,
  onToggle,
  children,
}: {
  readonly modes: Readonly<Record<string, FabOptionalTriggerAutomationMode>>;
  readonly disabledReason?: string;
  readonly onToggle?: FabOptionalTriggerAutomationContextValue["onToggle"];
  readonly children: ReactNode;
}) {
  const [announcement, setAnnouncement] = useState("");
  return (
    <FabOptionalTriggerAutomationContext.Provider
      value={{ modes, disabledReason, onToggle, announce: setAnnouncement }}
    >
      {children}
      <span className="fab-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </FabOptionalTriggerAutomationContext.Provider>
  );
}

export function FabOptionalTriggerAutomationControl({
  instanceId,
  cardName,
  canonicalId,
}: {
  readonly instanceId: string;
  readonly cardName: string;
  readonly canonicalId?: string;
}) {
  const context = useContext(FabOptionalTriggerAutomationContext);
  const mode = context?.modes[instanceId];
  const [open, setOpen] = useState(false);
  if (!context || !mode) return null;

  const enabled = mode !== "ask";
  const disabled = Boolean(context.disabledReason || !context.onToggle);
  const selectMode = (nextMode: FabOptionalTriggerAutomationMode) => {
    if (disabled || !context.onToggle) return;
    context.onToggle(instanceId, nextMode, cardName, canonicalId);
    context.announce(
      nextMode === "auto-accept"
        ? `Always use enabled for optional effects from ${cardName}`
        : nextMode === "auto-decline"
          ? `Always decline enabled for optional effects from ${cardName}`
          : `Optional effect prompts restored for ${cardName}`,
    );
    setOpen(false);
  };
  const options: readonly {
    mode: FabOptionalTriggerAutomationMode;
    label: string;
    description: string;
    icon: typeof Bell;
  }[] = [
    {
      mode: "ask",
      label: "Ask every time",
      description: "Show the optional-effect prompt.",
      icon: Bell,
    },
    {
      mode: "auto-accept",
      label: "Always use",
      description: "Use the effect, then yield priority for this trigger.",
      icon: BellRing,
    },
    {
      mode: "auto-decline",
      label: "Always decline",
      description: "Decline the effect, then yield priority for this trigger.",
      icon: BellOff,
    },
  ];
  const CurrentIcon = mode === "auto-accept" ? BellRing : mode === "auto-decline" ? BellOff : Bell;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <span
        className="fab-trigger-automation"
        data-enabled={enabled ? "true" : undefined}
        data-mode={mode}
        data-popover-open={open ? "true" : undefined}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            className="fab-trigger-automation__button"
            aria-label={`Configure optional effects for ${cardName}. Current setting: ${
              mode === "ask"
                ? "Ask every time"
                : mode === "auto-accept"
                  ? "Always use"
                  : "Always decline"
            }`}
            aria-expanded={open}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
            }}
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
            Choose how to handle this card&apos;s optional effects.
          </span>
          {context.disabledReason ? (
            <span className="fab-trigger-automation__popover-notice">{context.disabledReason}</span>
          ) : null}
          <div
            className="fab-trigger-automation__options"
            role="group"
            aria-label="Optional effect behavior"
          >
            {options.map((option) => {
              const OptionIcon = option.icon;
              const selected = option.mode === mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  className="fab-trigger-automation__option"
                  data-selected={selected ? "true" : undefined}
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => selectMode(option.mode)}
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
