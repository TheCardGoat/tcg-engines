#!/bin/zsh
set -u
cd /Users/wazar/projects/the-card-goat-online/submodules/flesh-and-blood
MALICE=cc-2026-09-12-domina-on-my-corpse-malice
VISERAI=cc-2026-09-12-new-vis-who-dis
for opp in cc-guilherme-coutinho-rhinar cc-edinburgh-1st-gravy-bones cc-las-vegas-1st-kassai cc-yan-pedroni-vynnset cc-austria-nats-2026-2nd-valda; do
  tag="${opp#cc-}"; tag="${tag%%-*}"
  pnpm --dir packages/engine run bench -- bench --p1 hero-profile --p2 hero-profile \
    --p1-deck "$MALICE" --p2-deck "$opp" --matches 16 \
    --out "packages/engine/reports/x-malice-vs-${tag}.json" --label "cross malice vs ${tag}" || exit 1
  pnpm --dir packages/engine run bench -- bench --p1 hero-profile --p2 hero-profile \
    --p1-deck "$VISERAI" --p2-deck "$opp" --matches 16 \
    --out "packages/engine/reports/x-viserai-vs-${tag}.json" --label "cross viserai vs ${tag}" || exit 1
done
echo SWEEP-DONE
