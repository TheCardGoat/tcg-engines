<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  import HotkeyDisplay from "@/features/simulator/hotkeys/HotkeyDisplay.svelte";
  import type { SimulatorHotkeyDescriptor } from "@/features/simulator/hotkeys/hotkey-bindings.js";
  import { m } from "$lib/i18n/messages.js";

  interface SimulatorHotkeysDialogProps {
    open?: boolean;
    descriptors: SimulatorHotkeyDescriptor[];
  }

  let { open = $bindable(false), descriptors }: SimulatorHotkeysDialogProps = $props();

  const groupedDescriptors = $derived.by(() => ({
    global: descriptors.filter((descriptor) => descriptor.kind === "global"),
    move: descriptors.filter((descriptor) => descriptor.kind === "move"),
    card: descriptors.filter((descriptor) => descriptor.kind === "card"),
  }));

  function handleSelect(descriptor: SimulatorHotkeyDescriptor): void {
    if (!descriptor.enabled) {
      return;
    }

    descriptor.execute();
    open = false;
  }
</script>

<Command.Dialog
  bind:open
  title={m["sim.hotkeys.title"]({})}
  description={m["sim.hotkeys.description"]({})}
  class="sim-hotkeys-dialog"
>
  <Command.Input placeholder={m["sim.hotkeys.searchPlaceholder"]({})} />
  <Command.List>
    <Command.Empty>{m["sim.hotkeys.empty"]({})}</Command.Empty>

    {#if groupedDescriptors.global.length > 0}
      <Command.Group heading={m["sim.hotkeys.group.global"]({})}>
        {#each groupedDescriptors.global as descriptor (descriptor.id)}
          <Command.Item
            value={`${descriptor.label} ${descriptor.hotkey}`}
            disabled={!descriptor.enabled}
            onSelect={() => handleSelect(descriptor)}
          >
            <span>{descriptor.label}</span>
            <Command.Shortcut>
              <HotkeyDisplay hotkey={descriptor.hotkey} />
            </Command.Shortcut>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    {#if groupedDescriptors.move.length > 0}
      <Command.Group heading={m["sim.hotkeys.group.moves"]({})}>
        {#each groupedDescriptors.move as descriptor (descriptor.id)}
          <Command.Item
            value={`${descriptor.label} ${descriptor.hotkey}`}
            disabled={!descriptor.enabled}
            onSelect={() => handleSelect(descriptor)}
          >
            <span>{descriptor.label}</span>
            <Command.Shortcut>
              <HotkeyDisplay hotkey={descriptor.hotkey} />
            </Command.Shortcut>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}

    {#if groupedDescriptors.card.length > 0}
      <Command.Group heading={m["sim.hotkeys.group.cards"]({})}>
        {#each groupedDescriptors.card as descriptor (descriptor.id)}
          <Command.Item
            value={`${descriptor.label} ${descriptor.hotkey}`}
            disabled={!descriptor.enabled}
            onSelect={() => handleSelect(descriptor)}
          >
            <span>{descriptor.label}</span>
            <Command.Shortcut>
              <HotkeyDisplay hotkey={descriptor.hotkey} />
            </Command.Shortcut>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}
  </Command.List>
</Command.Dialog>

<style>
  :global(.sim-hotkeys-dialog) {
    border: 1px solid rgba(108, 145, 192, 0.32) !important;
    background:
      linear-gradient(180deg, rgba(10, 20, 34, 0.98), rgba(6, 14, 24, 0.98)) !important;
    color: #e5edf7 !important;
    box-shadow: 0 24px 64px rgba(2, 8, 18, 0.58) !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command"]) {
    background: transparent !important;
    color: #e5edf7 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-input-wrapper"]) {
    padding: 0.75rem 0.75rem 0 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="input-group-root"]) {
    border-color: rgba(108, 145, 192, 0.26) !important;
    background: rgba(15, 28, 44, 0.94) !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-input"]) {
    color: #e5edf7 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-input"]::placeholder) {
    color: rgba(159, 178, 201, 0.85) !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-group"]) {
    color: #e5edf7 !important;
  }

  :global(.sim-hotkeys-dialog [cmdk-group-heading]),
  :global(.sim-hotkeys-dialog [data-slot="command-group-heading"]) {
    color: #8fa7c1 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-item"]) {
    color: #e5edf7 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-item"][data-selected]),
  :global(.sim-hotkeys-dialog [data-slot="command-item"]:hover) {
    background: rgba(20, 38, 61, 0.92) !important;
    color: #f8fbff !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-empty"]) {
    color: #9fb2c9 !important;
  }

  :global(.sim-hotkeys-dialog [data-slot="command-shortcut"]) {
    margin-left: auto;
    letter-spacing: normal;
  }
</style>
