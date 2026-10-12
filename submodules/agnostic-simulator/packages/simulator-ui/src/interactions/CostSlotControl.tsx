import type { OptionSelectionInput } from "@tcg/protocol";
import { Button, Group, NativeSelect, Stack, Text } from "@mantine/core";

/** Game-agnostic assignment: slots accept authored options and each entity pays once. */
export function CostSlotControl({
  input,
  value,
  disabled,
  onChange,
  onConfirm,
  onCancel,
  canConfirm,
  rejected,
}: {
  input: OptionSelectionInput;
  value: readonly string[];
  disabled?: boolean;
  onChange: (value: string[]) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  canConfirm: boolean;
  rejected?: boolean;
}) {
  if (input.presentation?.kind !== "cost-slots") return null;
  return (
    <Stack gap="sm" aria-label="Resource payment">
      <Text fw={600}>{input.text.key}</Text>
      <Text size="sm">Resources stay ready until payment succeeds.</Text>
      {input.presentation.slots.map((slot, index) => {
        const used = new Set(
          value.flatMap((id, other) =>
            other === index
              ? []
              : [input.options.find((option) => option.id === id)?.entity?.instanceId],
          ),
        );
        return (
          <NativeSelect
            styles={{ input: { minHeight: 44 } }}
            key={index}
            label={`Cost ${index + 1}: ${slot.text.key}`}
            disabled={disabled}
            value={value[index] ?? ""}
            onChange={(event) => {
              const next =
                input.presentation?.kind === "cost-slots"
                  ? input.presentation.slots.map((_, i) => value[i] ?? "")
                  : [];
              next[index] = event.currentTarget.value;
              onChange(next);
            }}
            data={[
              { value: "", label: "Choose a resource and color" },
              ...input.options
                .filter((option) => slot.optionIds.includes(option.id))
                .map((option) => ({
                  value: option.id,
                  label: option.text.key,
                  disabled: option.enabled === false || used.has(option.entity?.instanceId),
                })),
            ]}
          />
        );
      })}
      {rejected && (
        <Text role="alert">Payment was not accepted. Check your choices and retry.</Text>
      )}
      <Group>
        <Button disabled={disabled || !canConfirm} onClick={onConfirm}>
          Pay cost
        </Button>
        {onCancel && (
          <Button variant="subtle" disabled={disabled} onClick={onCancel}>
            Cancel payment
          </Button>
        )}
      </Group>
    </Stack>
  );
}
