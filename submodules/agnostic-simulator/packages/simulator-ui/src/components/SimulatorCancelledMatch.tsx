export interface SimulatorCancelledMatchProps {
  readonly reason: string;
  readonly matchmakingHref: string;
}

export function SimulatorCancelledMatch({ reason, matchmakingHref }: SimulatorCancelledMatchProps) {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#080e18] px-5 py-12 text-[#f6f2e9]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_32%,rgba(35,77,93,.42),transparent_58%),linear-gradient(135deg,rgba(214,171,91,.08),transparent_35%,rgba(25,49,68,.34))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(169,191,200,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(169,191,200,.15)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
      />
      <section className="relative w-full max-w-[680px] overflow-hidden rounded-[28px] border border-[#d8bd83]/25 bg-[#101b2a]/95 shadow-[0_32px_100px_rgba(0,0,0,.58),0_0_70px_rgba(73,144,160,.12)]">
        <div
          aria-hidden="true"
          className="h-1 w-full bg-gradient-to-r from-transparent via-[#dbb66e] to-transparent"
        />
        <div className="relative px-7 pb-8 pt-9 sm:px-12 sm:pb-11 sm:pt-11">
          <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.24em] text-[#d9b976]">
            <span className="flex size-9 items-center justify-center rounded-xl border border-[#d9b976]/30 bg-[#d9b976]/10">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3v18M5 4h13l-3 4 3 4H5" />
              </svg>
            </span>
            Session closed
          </div>
          <h1 className="m-0 text-4xl font-bold tracking-tight text-[#f8f4e9] sm:text-5xl">
            Match cancelled
          </h1>
          <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-[#bdcbd4]" role="status">
            {reason}
          </p>
          <div className="mt-9 border-t border-white/10 pt-7">
            <p className="m-0 mb-5 text-sm text-[#a9bdc8]">
              Ready for another game? Return to matchmaking to find an opponent.
            </p>
            <a
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#f4d38e] bg-[#d8af68] px-6 py-3 text-center text-sm font-extrabold uppercase tracking-[.09em] text-[#14212b] shadow-[0_8px_25px_rgba(216,175,104,.22)] transition-colors hover:bg-[#f1ce8c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1ce8c] sm:w-auto"
              href={matchmakingHref}
            >
              Return to matchmaking
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
