<script lang="ts">
    import { createFixture } from "@/features/simulator-devtools/fixtures/fixture-factory";
    import LorcanaBrowserHarnessView from "@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte";

    import {
        donaldDuckBoisterousFowl, hakunaMatata, letItGo, maximusPalaceHorse,
        mickeyMouseTrueFriend, suddenChill,
    } from "@tcg/lorcana-cards/cards/001";
    import { divebomb, lastditchEffort } from "@tcg/lorcana-cards/cards/003";
    import {
        aliceSavvySailor,
        liloEscapeArtist,
        loseTheWay,
        mauiHalfshark,
        tianaRestaurantOwner
    } from "@tcg/lorcana-cards/cards/006";
    import {
        donaldDuckAlongForTheRide, grandmotherWillowAncientAdvisor,
        grandmotherWillowAncientAdvisorEpic, lonelyGrave, olafSnowmanOfAction, wreckitRalphRagingWrecker,
    } from "@tcg/lorcana-cards/cards/011";
    import {
        daisyDuckDonaldsDate, kuzcoSelfishEmperor,
        merlinBackFromBermuda,
        merlinIntellectualVisionary
    } from "@tcg/lorcana-cards/cards/005";
    import {
        donaldDuckCoinCollector, downInNewOrleans,
        jasmineSteadyStrategist,
        jasmineSteadyStrategistEnchanted
    } from "@tcg/lorcana-cards/cards/008";
    import {donaldDuckBuccaneer} from "@tcg/lorcana-cards/cards/004";
    import {circleOfLife, cursedMerfolkUrsulasHandiwork} from "@tcg/lorcana-cards/cards/009";
    import {annaIceBreaker} from "@tcg/lorcana-cards/cards/007";
    import {hadesLookingForADeal} from "@tcg/lorcana-cards/cards/010";

    const fixture = createFixture({
        id: "special-targeting",
        name: "Special Targeting",
        description: "Cards that require specific targeting UI",
        playerOne: {
            inkwell: 5,
            hand: [hadesLookingForADeal],
            play: [
                mauiHalfshark,
                aliceSavvySailor,
                merlinBackFromBermuda,
                wreckitRalphRagingWrecker,
                grandmotherWillowAncientAdvisor,
                lonelyGrave,
            ],
            discard: [circleOfLife, hakunaMatata,
                liloEscapeArtist
            ],
            deck: [donaldDuckAlongForTheRide, divebomb, loseTheWay,maximusPalaceHorse, lastditchEffort, mickeyMouseTrueFriend, kuzcoSelfishEmperor],
        },
        playerTwo: {
            play: [
                grandmotherWillowAncientAdvisorEpic,
                {card: cursedMerfolkUrsulasHandiwork, exerted: true},
            ],
            inkwell: 8,
            hand: [hadesLookingForADeal],
            deck: [donaldDuckCoinCollector, suddenChill, donaldDuckBuccaneer,donaldDuckCoinCollector, suddenChill,]
        },
        skipPreGame: true,
    });
</script>

<LorcanaBrowserHarnessView {fixture} view="playerOne" />
