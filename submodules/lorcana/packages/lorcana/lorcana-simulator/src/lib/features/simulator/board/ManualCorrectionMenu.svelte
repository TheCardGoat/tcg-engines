<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LorcanaCardSnapshot } from "$lib/lorcana-simulator";
  import * as ContextMenu from "$lib/design-system/primitives/context-menu";
  import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";

  interface Props {
    card: LorcanaCardSnapshot;
    children: Snippet;
  }

  const { card, children }: Props = $props();
  const manualMode = getManualModeContext();
  const enabled = $derived(manualMode?.enabled ?? false);

  const damage = $derived(card.damage ?? 0);
  const currentZone = $derived(card.zoneId.split(":")[0] ?? "");
  const inPlay = $derived(currentZone === "play");

  function buildZoneId(zone: string): string {
    return `${zone}:${card.ownerId}`;
  }

  function handleDamageDelta(delta: number): void {
    if (!manualMode) return;
    manualMode.setDamage(card.cardId, Math.max(0, damage + delta));
  }

  function handleMoveTo(zone: string, position?: "top" | "bottom"): void {
    if (!manualMode) return;
    manualMode.moveCard(card.cardId, buildZoneId(zone), position);
  }
</script>

{#if enabled}
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      {@render children()}
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Label>Board State Correction</ContextMenu.Label>
      <ContextMenu.Separator />
      <ContextMenu.Item disabled={!inPlay} onSelect={() => handleDamageDelta(1)}>
        Damage +1
      </ContextMenu.Item>
      <ContextMenu.Item disabled={!inPlay || damage <= 0} onSelect={() => handleDamageDelta(-1)}>
        Damage −1
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger>Move to…</ContextMenu.SubTrigger>
        <ContextMenu.SubContent>
          <ContextMenu.Item onSelect={() => handleMoveTo("hand")}>Hand</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => handleMoveTo("play")}>Play</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => handleMoveTo("inkwell")}>Inkwell</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => handleMoveTo("discard")}>Discard</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => handleMoveTo("deck", "top")}>Deck (top)</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => handleMoveTo("deck", "bottom")}>Deck (bottom)</ContextMenu.Item>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </ContextMenu.Content>
  </ContextMenu.Root>
{:else}
  {@render children()}
{/if}
