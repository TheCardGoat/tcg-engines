import { Button, Group, Popover, Stack, Text } from "@mantine/core";
import { CircleDollarSign } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { SimulatorParticipantActionButton } from "../../../../simulator/participant-actions/SimulatorParticipantActions";
import participantClasses from "../../../../simulator/participant-actions/SimulatorParticipantActions.module.css";
import classes from "./PaymentSelectionPlayerAction.module.css";
import { useSetUserConfig, useUserConfig } from "../../engine/UserConfigContext";

export const CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY =
  "tcg:cyberpunk:payment-selection-discovery:v1";

const SuppressPaymentDiscoveryContext = createContext(false);

export function SuppressPaymentDiscovery({ children }: { readonly children: ReactNode }) {
  return (
    <SuppressPaymentDiscoveryContext.Provider value>
      {children}
    </SuppressPaymentDiscoveryContext.Provider>
  );
}

function persistDiscoveryDismissal(): void {
  try {
    window.localStorage.setItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY, "dismissed");
  } catch {
    // Storage restrictions must never prevent opening player actions.
  }
}

/** One-time, non-modal discovery anchored to the real Player Info control. */
export function CyberpunkPaymentSelectionDiscovery({ children }: { readonly children: ReactNode }) {
  const suppressed = useContext(SuppressPaymentDiscoveryContext);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    try {
      setOpened(
        !suppressed &&
          window.localStorage.getItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY) !== "dismissed",
      );
    } catch {
      setOpened(!suppressed);
    }
  }, [suppressed]);

  if (suppressed) return <>{children}</>;

  const dismiss = () => {
    setOpened(false);
    persistDiscoveryDismissal();
  };

  return (
    <Popover
      opened={opened}
      position="bottom-end"
      width={264}
      zIndex={5100}
      transitionProps={{ duration: 0 }}
      withArrow
      withinPortal
      trapFocus={false}
      closeOnClickOutside={false}
      closeOnEscape
      onDismiss={dismiss}
    >
      <Popover.Target>
        <span style={{ display: "inline-flex", minWidth: 0 }} onClickCapture={dismiss}>
          {children}
        </span>
      </Popover.Target>
      <Popover.Dropdown aria-label="Choose how you pay" maw="calc(100vw - 16px)">
        <Stack gap="xs">
          <Text size="sm" fw={600}>
            Choose how you pay
          </Text>
          <Text size="sm">
            Use the payment shortcut beside Player Info to choose eligible Eddies or Legends. Card
            plays that use all ready Eddies or all available resources pay automatically. This
            setting is saved to your Cyberpunk profile.
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button variant="light" size="compact-sm" onClick={dismiss}>
              Got it
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export function CyberpunkPaymentSelectionShortcut({ labeled = false }: { labeled?: boolean }) {
  const { choosePaymentSources } = useUserConfig();
  const setConfig = useSetUserConfig();
  const label = choosePaymentSources ? "Manual payment enabled" : "Choose payment for every cost";
  const tooltip = choosePaymentSources
    ? "Manual payment is enabled. Full-cost card plays pay automatically. Click to restore automatic payment."
    : "Choose eligible Eddies or Legends for payment. Full-cost card plays pay automatically.";

  return (
    <SimulatorParticipantActionButton
      type="button"
      className={`${classes.shortcut} ${labeled ? classes.labeled : ""}`}
      tooltip={tooltip}
      aria-label={labeled ? "Manual payment" : label}
      aria-pressed={choosePaymentSources}
      data-active={choosePaymentSources ? "true" : undefined}
      onClick={() => setConfig({ choosePaymentSources: !choosePaymentSources })}
    >
      <CircleDollarSign aria-hidden="true" size={18} />
      {labeled && (
        <>
          <span>Manual payment</span>
          <strong>{choosePaymentSources ? "On" : "Off"}</strong>
        </>
      )}
    </SimulatorParticipantActionButton>
  );
}

export function CyberpunkPaymentSelectionPlayerAction({
  onComplete,
}: {
  readonly onComplete: () => void;
}) {
  const { choosePaymentSources } = useUserConfig();
  const setConfig = useSetUserConfig();

  return (
    <button
      type="button"
      role="menuitem"
      className={participantClasses.menuItem}
      aria-pressed={choosePaymentSources}
      onClick={() => {
        setConfig({ choosePaymentSources: !choosePaymentSources });
        onComplete();
      }}
    >
      <CircleDollarSign aria-hidden="true" size={16} />
      <span>
        {choosePaymentSources ? "Manual payment enabled" : "Choose payment for every cost"}
      </span>
    </button>
  );
}
