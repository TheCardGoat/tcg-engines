<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import { DISNEY_LORCANA_OFFICIAL_URL } from "./matchmaking-lobby.constants.js";
</script>

<footer
  class="z-20 flex w-full shrink-0 flex-col border-t border-white/10 bg-slate-950/92 shadow-[0_-24px_60px_-36px_rgba(2,6,23,1)] backdrop-blur-xl max-h-[72px] min-h-0 overflow-hidden"
>
  <div class="mx-auto flex w-full max-w-6xl flex-col px-3 py-1 sm:px-6 lg:px-8 min-h-0 flex-1">
    <div
      class="space-y-2 text-[0.6875rem] leading-snug text-slate-400 sm:text-xs sm:leading-snug min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
    >
      <p class="text-pretty">
        {m["sim.matchmaking.footer.disclaimerPara1Prefix"]({})}
        <a
          href={DISNEY_LORCANA_OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-sky-300/90 underline underline-offset-2 hover:text-sky-200"
          aria-label={m["sim.matchmaking.footer.disclaimerOfficialSiteAria"]({})}
        >
          {m["sim.matchmaking.footer.disclaimerOfficialSiteLabel"]({})}
        </a>.
      </p>
      <p class="text-pretty">{m["sim.matchmaking.footer.disclaimerPara2"]({})}</p>
      <p class="text-pretty">{m["sim.matchmaking.footer.disclaimerPara3"]({})}</p>
    </div>
  </div>
</footer>
