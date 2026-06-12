<script lang="ts">
  interface ZoneLabelProps {
    label: string;
    count?: number;
  }

  let { label, count }: ZoneLabelProps = $props();
</script>

<div class="flex items-center justify-center gap-[0.35rem] px-2 py-1">
  <span class="text-[0.6rem] font-semibold uppercase tracking-widest text-slate-400/[0.66]">
    {label}
  </span>
  {#if count !== undefined}
    <span
      class="text-[0.65rem] font-bold text-slate-200 bg-black/30 px-[0.35rem] py-[0.1rem] rounded-full min-w-[1.2rem] text-center"
    >
      {count}
    </span>
  {/if}
</div>
