<script lang="ts">
  import { onDestroy } from "svelte";
  import { LoaderCircle, Lock, NotebookPen } from "@lucide/svelte";
  import { m } from "$lib/i18n/messages.js";
  import { Button } from "$lib/design-system/primitives/button";
  import * as Sheet from "$lib/design-system/primitives/sheet";
  import {
    fetchPostGameRecord,
    savePostGameNote,
    type PostGameRecordEnvelope,
  } from "@/features/simulator/post-game/notes-api.js";
  import type { PostGameNoteState } from "@/features/simulator/post-game/types.js";

  interface ReplayNotesPanelProps {
    gameId: string;
    isAuthenticated: boolean;
    open?: boolean;
  }

  let {
    gameId,
    isAuthenticated,
    open = $bindable(false),
  }: ReplayNotesPanelProps = $props();

  let noteState = $state<PostGameNoteState>({
    value: "",
    lastSavedValue: "",
    isLoading: false,
    isSaving: false,
    loaded: false,
    error: null,
  });

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const noteDirty = $derived(
    noteState.loaded && noteState.value.trim() !== noteState.lastSavedValue.trim(),
  );

  const noteStatus = $derived.by(() => {
    if (noteState.isLoading) return m["sim.postGame.notes.loading"]({});
    if (noteState.isSaving) return m["sim.postGame.notes.saving"]({});
    if (noteState.error) return noteState.error;
    if (!noteState.loaded) return m["sim.postGame.notes.idle"]({});
    if (noteDirty) return m["sim.postGame.notes.unsaved"]({});
    return m["sim.postGame.notes.saved"]({});
  });

  async function loadNotes(): Promise<void> {
    if (noteState.loaded || noteState.isLoading || !isAuthenticated) return;

    noteState.isLoading = true;
    noteState.error = null;

    try {
      const envelope: PostGameRecordEnvelope = await fetchPostGameRecord(gameId);
      noteState.value = envelope.note;
      noteState.lastSavedValue = envelope.note;
      noteState.loaded = true;
    } catch (err) {
      noteState.error =
        err instanceof Error ? err.message : m["sim.postGame.notes.loadError"]({});
      noteState.loaded = true;
    } finally {
      noteState.isLoading = false;
    }
  }

  async function handleSave(): Promise<void> {
    if (noteState.isSaving || !noteDirty) return;

    noteState.isSaving = true;
    noteState.error = null;

    try {
      const envelope = await savePostGameNote({ gameId, note: noteState.value });
      noteState.lastSavedValue = envelope.note;
    } catch (err) {
      noteState.error =
        err instanceof Error ? err.message : m["sim.postGame.notes.saveError"]({});
    } finally {
      noteState.isSaving = false;
    }
  }

  function clearDebounce(): void {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  // Load notes when the sheet first opens
  $effect(() => {
    if (open && !noteState.loaded && !noteState.isLoading && isAuthenticated) {
      loadNotes();
    }
  });

  // Debounced auto-save on value changes
  $effect(() => {
    // Subscribe to value changes
    const _value = noteState.value;

    if (!noteState.loaded || noteState.isLoading) return;

    clearDebounce();
    debounceTimer = setTimeout(() => {
      if (noteDirty && !noteState.isSaving) {
        handleSave();
      }
    }, 2000);

    return () => clearDebounce();
  });

  onDestroy(() => {
    clearDebounce();
  });
</script>

<Sheet.Sheet bind:open>
  <Sheet.Content
    side="right"
    class="border-white/10 bg-slate-950/95 text-slate-100 backdrop-blur-md sm:max-w-sm"
  >
    <Sheet.Header class="space-y-1">
      <Sheet.Title class="flex items-center gap-2 text-slate-100">
        <NotebookPen class="size-4" />
        {m["sim.postGame.notes.title"]({})}
      </Sheet.Title>
      <Sheet.Description class="text-slate-400">
        {m["sim.postGame.notes.description"]({})}
      </Sheet.Description>
    </Sheet.Header>

    {#if !isAuthenticated}
      <div class="flex flex-col items-center gap-3 py-8 text-center">
        <Lock class="size-6 text-slate-500" />
        <h4 class="text-sm font-medium text-slate-300">
          {m["sim.postGame.notes.authRequired"]({})}
        </h4>
        <p class="max-w-[240px] text-xs text-slate-500">
          {m["sim.postGame.notes.authRequiredDetail"]({})}
        </p>
      </div>
    {:else}
      <div class="flex flex-1 flex-col gap-3">
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-1.5 text-xs font-medium text-slate-400" for="replay-notes">
            {m["sim.postGame.notes.fieldLabel"]({})}
            {#if noteDirty}
              <span class="size-1.5 rounded-full bg-amber-400"></span>
            {/if}
          </label>
          <div class="flex items-center gap-2">
            {#if noteState.isLoading || noteState.isSaving}
              <LoaderCircle class="size-3.5 animate-spin text-slate-400" />
            {/if}
            <Button
              variant="outline"
              size="sm"
              class="h-7 border-white/10 bg-transparent px-2.5 text-xs text-slate-300 hover:text-slate-100"
              onclick={handleSave}
              disabled={noteState.isSaving || noteState.isLoading || !noteDirty}
            >
              {m["sim.postGame.notes.save"]({})}
            </Button>
          </div>
        </div>

        <textarea
          id="replay-notes"
          class="min-h-[200px] flex-1 resize-y rounded-md border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          bind:value={noteState.value}
          placeholder={m["sim.postGame.notes.placeholder"]({})}
          disabled={noteState.isLoading}
        ></textarea>

        <p
          class="text-xs {noteState.error ? 'text-rose-400' : 'text-slate-500'}"
        >
          {noteStatus}
        </p>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Sheet>
