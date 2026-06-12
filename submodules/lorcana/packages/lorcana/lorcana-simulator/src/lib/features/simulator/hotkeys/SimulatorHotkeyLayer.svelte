<script lang="ts">
  import { createHotkeys } from "@tanstack/svelte-hotkeys";
  import type { RegisterableHotkey } from "@tanstack/svelte-hotkeys";
  import type { SimulatorHotkeyDescriptor } from "@/features/simulator/hotkeys/hotkey-bindings.js";

  interface SimulatorHotkeyLayerProps {
    descriptors: SimulatorHotkeyDescriptor[];
    paused?: boolean;
  }

  let { descriptors, paused = false }: SimulatorHotkeyLayerProps = $props();

  createHotkeys(
    () =>
      descriptors.map((descriptor) => ({
        hotkey: descriptor.hotkey as RegisterableHotkey,
        callback: () => {
          descriptor.execute();
        },
        options: {
          enabled: !paused && descriptor.enabled,
        },
      })),
    {
      ignoreInputs: true,
      preventDefault: true,
      stopPropagation: true,
    },
  );
</script>
