<script lang="ts">
import HotkeyDisplay from "@/features/simulator/hotkeys/HotkeyDisplay.svelte";

interface HotkeyCardBadgeProps {
	hotkey: string;
}

let { hotkey }: HotkeyCardBadgeProps = $props();
</script>

<div
  class="hotkey-card-badge pointer-events-none absolute top-1 right-1 z-30"
  aria-hidden="true"
>
  <HotkeyDisplay
    hotkey={hotkey}
    keyClass="h-5 min-w-5 px-1.5 text-[0.7rem] font-bold tracking-wide text-white !rounded-md !border !border-white/25 !bg-black/70 backdrop-blur-sm shadow-[0_2px_6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.18)]"
  />
</div>

<style>
  .hotkey-card-badge {
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.6));
  }
</style>
