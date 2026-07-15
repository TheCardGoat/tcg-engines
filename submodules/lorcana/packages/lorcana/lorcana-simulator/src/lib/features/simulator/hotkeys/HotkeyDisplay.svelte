<script lang="ts">
import * as Kbd from "$lib/components/ui/kbd/index.js";
import { cn } from "$lib/utils.js";
import { getFormattedHotkeyParts } from "@/features/simulator/hotkeys/hotkey-bindings.js";

interface HotkeyDisplayProps {
	hotkey: string;
	class?: string;
	keyClass?: string;
}

let { hotkey, class: className, keyClass }: HotkeyDisplayProps = $props();
const parts = $derived(getFormattedHotkeyParts(hotkey));
</script>

<Kbd.Group 
class={cn("inline-flex items-center gap-1", className)}
    data-test-id={`hotkey-${hotkey}`}
>
  {#each parts as part (part)}
    <Kbd.Root class={cn("font-mono", keyClass)}>{part}</Kbd.Root>
  {/each}
</Kbd.Group>
