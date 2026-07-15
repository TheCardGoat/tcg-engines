<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { m } from "$lib/i18n/messages.js";

  type DropState = "valid" | "invalid";

  interface DropIndicatorProps {
    state: DropState;
    message?: string;
  }

  let { state, message }: DropIndicatorProps = $props();

  const defaultMessages = {
    valid: m["sim.drop.valid"]({}),
    invalid: m["sim.drop.invalid"]({}),
  };

  const displayMessage = $derived(message ?? defaultMessages[state]);
</script>

<div
  class={cn(
    "absolute inset-0 flex items-center justify-center rounded-xl pointer-events-none animate-fade-in",
    state === "invalid" ? "bg-red-500/[0.14]" : "bg-emerald-500/12"
  )}
>
  <span
    class={cn(
      "text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md bg-slate-900/90 backdrop-blur-sm",
      state === "invalid" ? "text-red-300" : "text-slate-200"
    )}
  >
    {displayMessage}
  </span>
</div>
