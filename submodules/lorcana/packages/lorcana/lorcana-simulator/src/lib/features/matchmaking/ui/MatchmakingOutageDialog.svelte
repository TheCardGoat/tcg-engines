<script lang="ts">
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import { m } from "$lib/i18n/messages.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  let { open = $bindable(true) }: { open?: boolean } = $props();
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content class="border-amber-300/35 bg-slate-950 text-slate-50 sm:max-w-md">
    <AlertDialog.Header>
      <AlertDialog.Media class="bg-amber-400/15 text-amber-200">
        <TriangleAlert class="size-5" aria-hidden="true" />
      </AlertDialog.Media>
      <AlertDialog.Title class="text-xl">{m["sim.matchmaking.outage.title"]({})}</AlertDialog.Title>
      <AlertDialog.Description class="max-w-sm text-slate-300">
        {m["sim.matchmaking.outage.description"]({})}
      </AlertDialog.Description>
    </AlertDialog.Header>

    <AlertDialog.Footer class="border-amber-200/10 bg-amber-400/5">
      <AlertDialog.Action
        class="w-full bg-amber-300 text-slate-950 hover:bg-amber-200 sm:w-auto"
        onclick={() => {
          open = false;
        }}
      >
        {m["sim.matchmaking.outage.dismiss"]({})}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
