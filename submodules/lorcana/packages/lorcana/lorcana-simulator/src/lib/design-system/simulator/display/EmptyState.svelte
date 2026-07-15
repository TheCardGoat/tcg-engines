<script lang="ts">
  import { m } from "$lib/i18n/messages.js";

  interface EmptyStateProps {
    label?: string;
    icon?: string;
  }

  let { label = m["sim.tabletop.empty"]({}), icon = "◦" }: EmptyStateProps = $props();
</script>

<div class="flex flex-col items-center justify-center gap-1 p-4 text-slate-400/30">
  <span class="text-1.5rem leading-none">{icon}</span>
  <span class="text-[0.65rem] uppercase tracking-wide">{label}</span>
</div>
