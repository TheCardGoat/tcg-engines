<script lang="ts">
    import type {MoveLogEntrySnapshot} from "@/features/simulator/model/contracts.js";

  interface LogEntryProps {
    entry: MoveLogEntrySnapshot;
  }

  let { entry }: LogEntryProps = $props();

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
</script>

<article class="log-entry">
  <header class="log-entry-header">
    <span class="log-title">{entry.title}</span>
    <time class="log-time">{formatTime(entry.timestamp)}</time>
  </header>
</article>

<style>
  .log-entry {
    border: 1px solid rgba(71, 85, 105, 0.45);
    border-radius: 8px;
    padding: 0.45rem 0.55rem;
    background: rgba(15, 23, 42, 0.78);
    transition: background 150ms ease;
  }

  .log-entry:hover {
    background: rgba(25, 40, 65, 0.85);
  }

  .log-entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
  }

  .log-title {
    color: #e2e8f0;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .log-time {
    color: #93a6bd;
    font-size: 0.7rem;
    font-variant-numeric: tabular-nums;
  }

</style>
