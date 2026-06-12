<script lang="ts">
  interface InkwellReminderProps {
    isOpponent?: boolean;
  }

  let { isOpponent = false }: InkwellReminderProps = $props();
</script>

<div
  class={`inkwell-reminder ${isOpponent ? "inkwell-reminder--opponent" : ""}`}
  aria-hidden="true"
>
  <span class="inkwell-reminder-plus">+</span>
</div>

<style>
  .inkwell-reminder {
    width: var(--ink-card-width, 26px);
    height: var(--ink-card-height, 36px);
    border: 1px dashed rgba(180, 160, 220, 0.65);
    border-radius: 6px;
    background:
      linear-gradient(180deg, rgba(84, 63, 130, 0.16), rgba(31, 24, 52, 0.1)),
      rgba(18, 14, 31, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  }

  .inkwell-reminder--opponent {
    border-color: rgba(220, 160, 160, 0.55);
    background:
      linear-gradient(180deg, rgba(121, 62, 78, 0.14), rgba(48, 23, 31, 0.1)),
      rgba(30, 14, 20, 0.18);
  }

  .inkwell-reminder-plus {
    color: rgba(226, 232, 240, 0.82);
    font-size: 1rem;
    line-height: 1;
    font-weight: 700;
  }
</style>
