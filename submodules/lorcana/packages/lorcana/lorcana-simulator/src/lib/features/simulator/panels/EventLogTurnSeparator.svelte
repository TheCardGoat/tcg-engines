<script lang="ts">
  import { Flag } from "@lucide/svelte";

  interface Props {
    label: string;
  }

  let { label }: Props = $props();
</script>

<div class="sticky top-0 z-[1] py-1">
  <div class="flex items-center gap-2 rounded-full bg-slate-950/90 px-1 py-1 backdrop-blur">
    <div class="h-px flex-1 bg-gradient-to-r from-transparent via-sky-300/30 to-sky-300/10"></div>
    <div
      class="inline-flex items-center gap-1.5 rounded-full border border-sky-300/20 bg-slate-900/95 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sky-100/80"
    >
      <Flag class="size-3.5" />
      <span>{label}</span>
    </div>
    <div class="h-px flex-1 bg-gradient-to-l from-transparent via-sky-300/30 to-sky-300/10"></div>
  </div>
</div>
