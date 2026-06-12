<script lang="ts">
  import { Card, CardContent } from "$lib/design-system/primitives/card";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";
  import Package from "@lucide/svelte/icons/package";

  interface Props {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  }

  let {
    title,
    description = "",
    actionLabel = "",
    onAction,
  }: Props = $props();

  const displayTitle = $derived(title ?? m["sim.deckVault.empty.title"]({}));
</script>

<Card class="border-dashed">
  <CardContent class="flex flex-col items-center justify-center py-12 text-center">
    <div class="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
      <Package class="size-6 text-muted-foreground" />
    </div>
    <h3 class="text-lg font-semibold text-card-foreground">{displayTitle}</h3>
    {#if description}
      <p class="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    {/if}
    {#if actionLabel && onAction}
      <div class="mt-4">
        <Button size="sm" onclick={onAction}>{actionLabel}</Button>
      </div>
    {/if}
  </CardContent>
</Card>
