import { Button, Group, Text } from "@mantine/core";
import type { EngineInteractionView } from "@tcg/protocol";
import { useInteractionDraft } from "@tcg/simulator-ui";

/** Keep the chosen route editable while the shared prompt collects its payments. */
export function CostRouteControl({
  view,
  disabled,
  showUnselected = false,
}: {
  view: EngineInteractionView;
  disabled?: boolean;
  showUnselected?: boolean;
}) {
  const draft = useInteractionDraft();
  const action = view.actions.find((action) => action.id === draft.actionId);
  const route = action?.inputs.find((input) => input.id === "costRoute");
  const value = draft.values.costRoute;
  if (route?.kind !== "option-selection" || (!showUnselected && !Array.isArray(value))) return null;
  const selected = Array.isArray(value) ? value : [];
  return (
    <div aria-label="Cost route">
      <Text size="xs" c="dimmed">
        Changing route clears all payment choices.
      </Text>
      <Group gap="xs" mt={4} mb={8}>
        {route.options.map((option) => (
          <Button
            key={option.id}
            size="xs"
            variant={selected.includes(option.id) ? "filled" : "light"}
            aria-pressed={selected.includes(option.id)}
            title={option.text.key}
            disabled={disabled || !option.enabled}
            onClick={() => {
              if (!selected.includes(option.id)) draft.change(route.id, [option.id]);
            }}
          >
            {option.id === "normal"
              ? option.text.key.startsWith("Required")
                ? "Additional (required)"
                : "Normal"
              : option.id === "alternative"
                ? "Alternative"
                : "Additional"}
          </Button>
        ))}
      </Group>
    </div>
  );
}
