/*
  ============================================================
  YOUR STASHES — this is the only file you need to edit.
  ============================================================

  Each stash is one block between { and }. To add a stash, copy a
  whole block (including the comma after the closing }) and change it.

  id      A short unique name with no spaces, e.g. "pier-locker".
          Never change it after the site is live, or players lose
          their tick for that stash.
  money   The payout as a plain number, no $ and no commas: 25000
  x, y    Where the pin goes on the map, as a percentage:
            x = 0 is the left edge, 100 is the right edge
            y = 0 is the top edge,  100 is the bottom edge
          Tip: open the site with ?pick at the end of the address
          (e.g. index.html?pick) and tap the map. It shows the x and y
          of that spot so you can copy them here.
  name / place   The text in English (en) and Spanish (es).

  The 3 stashes below are SAMPLES. Replace them with real ones.
*/

window.STASHES = [
  {
    id: "sample-pier-locker",
    money: 25000,
    x: 85.5,
    y: 46.0,
    name: {
      en: "Sample: Pier Locker",
      es: "Ejemplo: Casillero del muelle"
    },
    place: {
      en: "Behind the bait shop at the end of the beach pier, east coast.",
      es: "Detrás de la tienda de carnada al final del muelle de la playa, costa este."
    }
  },
  {
    id: "sample-swamp-boat",
    money: 12500,
    x: 46.0,
    y: 51.0,
    name: {
      en: "Sample: Sunken Airboat",
      es: "Ejemplo: Hidrodeslizador hundido"
    },
    place: {
      en: "Half-sunk airboat in the middle of the wetlands. Bring a boat.",
      es: "Hidrodeslizador medio hundido en el centro del pantano. Lleva un bote."
    }
  },
  {
    id: "sample-keys-bait-box",
    money: 8000,
    x: 63.0,
    y: 82.0,
    name: {
      en: "Sample: Keys Bait Box",
      es: "Ejemplo: Caja de carnada de los cayos"
    },
    place: {
      en: "Cooler under the bridge on the island chain, south of the mainland.",
      es: "Nevera bajo el puente en la cadena de islas, al sur del continente."
    }
  }
];
