import { Button, Group, Popover, Stack, Text } from "@mantine/core";
import { CircleDollarSign } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { SimulatorParticipantActionButton } from "../../../../simulator/participant-actions/SimulatorParticipantActions";
import participantClasses from "../../../../simulator/participant-actions/SimulatorParticipantActions.module.css";
import classes from "./PaymentSelectionPlayerAction.module.css";
import { usePaymentSelection } from "./PaymentSelectionContext";

export const CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY =
  "tcg:cyberpunk:payment-selection-discovery:v1";

function persistDiscoveryDismissal(): void {
  try {
    window.localStorage.setItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY, "dismissed");
  } catch {
    // Storage restrictions must never prevent opening player actions.
  }
}

/** One-time, non-modal discovery anchored to the real Player Info control. */
export function CyberpunkPaymentSelectionDiscovery({ children }: { readonly children: ReactNode }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    try {
      setOpened(
        window.localStorage.getItem(CYBERPUNK_PAYMENT_DISCOVERY_STORAGE_KEY) !== "dismissed",
      );
    } catch {
      setOpened(true);
    }
  }, []);

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
            Use the payment shortcut beside Player Info to choose the eligible Eddies or Legends
            spent on your next cost. Automatic payment stays the default.
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

export function CyberpunkPaymentSelectionShortcut() {
  const { nextPaymentSelectionArmed, toggleNextPaymentSelection } = usePaymentSelection();
  const label = nextPaymentSelectionArmed
    ? "Manual payment armed for next cost"
    : "Choose payment for next cost";
  const tooltip = nextPaymentSelectionArmed
    ? "Manual payment is armed for your next cost. Click to return to automatic payment."
    : "Choose the eligible Eddies or Legends spent for your next cost instead of paying automatically.";

  return (
    <SimulatorParticipantActionButton
      type="button"
      className={classes.shortcut}
      tooltip={tooltip}
      aria-label={label}
      aria-pressed={nextPaymentSelectionArmed}
      data-active={nextPaymentSelectionArmed ? "true" : undefined}
      onClick={toggleNextPaymentSelection}
    >
      <CircleDollarSign aria-hidden="true" size={18} />
    </SimulatorParticipantActionButton>
  );
}

export function CyberpunkPaymentSelectionPlayerAction({
  onComplete,
}: {
  readonly onComplete: () => void;
}) {
  const { nextPaymentSelectionArmed, toggleNextPaymentSelection } = usePaymentSelection();

  return (
    <button
      type="button"
      role="menuitem"
      className={participantClasses.menuItem}
      aria-pressed={nextPaymentSelectionArmed}
      onClick={() => {
        toggleNextPaymentSelection();
        onComplete();
      }}
    >
      <CircleDollarSign aria-hidden="true" size={16} />
      <span>
        {nextPaymentSelectionArmed
          ? "Manual payment armed for next cost"
          : "Choose payment for next cost"}
      </span>
    </button>
  );
}
