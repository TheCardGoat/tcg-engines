//https://bost.ocks.org/mike/shuffle/
import { notEmptyPredicate } from "@lorcanito/lorcana-engine";

export function shuffle<T>(array: (T | undefined)[]): T[] {
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array.filter(notEmptyPredicate);
}

export function shuffleDeck(deck: string[]): string[] {
  return knuthShuffle(deck) as string[];
}

function knuthShuffle(originalArray: unknown[]) {
  const array = [...originalArray];
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function durstenfeldShuffle(originalArray: unknown[]) {
  const array = [...originalArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
