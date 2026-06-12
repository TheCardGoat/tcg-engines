<script lang="ts">
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { Button } from "$lib/design-system/primitives/button";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { m } from "$lib/i18n/messages.js";
  import Loader from "@lucide/svelte/icons/loader-circle";

  let {
    open = $bindable(false),
    deckName = $bindable(""),
    deckText = $bindable(""),
    disabled = false,
    submitting = false,
    error = null,
    onSubmit,
  }: {
    open: boolean;
    deckName: string;
    deckText: string;
    disabled?: boolean;
    submitting?: boolean;
    error?: string | null;
    onSubmit: () => void | Promise<void>;
  } = $props();

  function handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void onSubmit();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="border-white/10 bg-slate-950/98 text-slate-100 sm:max-w-xl">
      <Dialog.Header>
        <Dialog.Title class="text-2xl">
          {m["sim.matchmaking.importDeck.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-slate-300">
          {m["sim.matchmaking.importDeck.description"]({})}
        </Dialog.Description>
      </Dialog.Header>

      <form class="space-y-4" onsubmit={handleSubmit}>
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-100" for="matchmaking-import-deck-name">
            {m["sim.matchmaking.importDeck.nameLabel"]({})}
          </label>
          <Input
            id="matchmaking-import-deck-name"
            bind:value={deckName}
            disabled={submitting}
            maxlength={120}
            placeholder={m["sim.matchmaking.importDeck.namePlaceholder"]({})}
            class="border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-100" for="matchmaking-import-deck-text">
            {m["sim.matchmaking.importDeck.textLabel"]({})}
          </label>
          <Textarea
            id="matchmaking-import-deck-text"
            bind:value={deckText}
            disabled={submitting}
            rows={12}
            placeholder={m["sim.matchmaking.importDeck.textPlaceholder"]({})}
            class="min-h-48 border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-400"
          />
          <p class="text-xs leading-5 text-slate-400">
            {m["sim.matchmaking.importDeck.help"]({})}
          </p>
        </div>

        {#if error}
          <div
            class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200"
            role="alert"
          >
            {error}
          </div>
        {/if}

        <Dialog.Footer class="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            class="border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
            onclick={() => {
              open = false;
            }}
          >
            {m["sim.matchmaking.importDeck.cancel"]({})}
          </Button>
          <Button type="submit" disabled={disabled} class="min-w-36">
            {#if submitting}
              <Loader class="mr-2 size-4 animate-spin" />
              {m["sim.matchmaking.importDeck.submitting"]({})}
            {:else}
              {m["sim.matchmaking.importDeck.submit"]({})}
            {/if}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
