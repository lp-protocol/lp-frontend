import React, { memo, useMemo, useRef, useState } from 'react';
import sprite from './sprite';

function* pseudoRandom(seed: number): Generator<number, number, number> {
  let value = seed;

  while (true) {
    value = (value * 16807) % 2147483647;
    yield value;
  }
}

export const Randomizer = memo(function Randomizer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [flipper, updateFlipper] = useState(false);
  const generator = useMemo(
    () => pseudoRandom(Math.floor(Math.random() * 2147483647)),
    [flipper]
  );

  React.useEffect(() => {
    const t = setTimeout(() => {
      updateFlipper(!flipper);
    }, 450);
    return () => {
      clearTimeout(t);
    };
  }, [flipper]);

  React.useEffect(() => {
    const r = (s: any, from: any, to: any) => from + (s % (to - from + 1));

    // 0 body
    // 1 - 2 back decor
    // 3 - 15 clothes
    // 16 - 17 gloves
    // 18 - 39 hats
    // 40 - 49 kits (accessories)
    // 50 - 58 logos
    // 59 - 62 pants
    // 63 - 71 hand
    // 72 - 75 shorts
    // 76 - 83 shirt
    const img = new Image();

    const run = () => {
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, 40, 40);
      const hasShirt = r(generator.next().value + 4, 1, 100) <= 96;
      let traits = {
        kitBack: 0,
        back:
          r(generator.next().value, 1, 100) <= 100
            ? r(generator.next().value, 1, 2)
            : 0,
        body: 0,
        pants:
          r(generator.next().value, 1, 100) <= 50
            ? r(generator.next().value, 59, 62)
            : r(generator.next().value, 72, 75),
        shirt: hasShirt ? r(generator.next().value, 76, 83) : 0,
        logo:
          r(generator.next().value, 1, 100) <= 60 && hasShirt
            ? r(generator.next().value, 50, 58)
            : 0,
        clothingItem:
          r(generator.next().value, 1, 100) <= 90
            ? r(generator.next().value, 3, 15)
            : 0,
        gloves:
          r(generator.next().value, 1, 100) <= 50
            ? r(generator.next().value, 16, 17)
            : 0,
        hat:
          r(generator.next().value, 1, 100) <= 80
            ? r(generator.next().value, 18, 39)
            : 0,
        // special case for kits
        kitFront: 0,
        hand:
          r(generator.next().value, 1, 100) <= 80
            ? r(generator.next().value, 63, 71)
            : 0,
      };

      const kit =
        r(generator.next().value, 1, 100) <= 50
          ? r(generator.next().value, 1, 4)
          : 0;

      switch (kit) {
        // unicorn
        case 1:
          traits.back = 49;
          traits.kitFront = 40;
          break;
        // astro
        case 2:
          traits.back = 41;
          traits.kitFront = 42;
          traits.hat = 43;
          break;
        // back pack (explorer)
        case 3:
          traits.kitFront = 45;
          traits.back = 44;
          break;
        // Twilight Knight
        case 4:
          traits.back = 46;
          traits.kitFront = 47;
          traits.hat = 48;
          break;

        default:
          break;
      }

      // back
      // body
      // pants/shorts
      // shirt
      // logo
      // hat
      // kit

      const colors = ['#f8f8f8', '#E5FBEF', '#F5FCDD', '#FDEEE8', '#E5F1F6'];

      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(0, 0, 40, 40);

      Object.entries(traits).forEach(([trait, tile], i) => {
        if (tile === 0 && trait !== 'body') return;

        const col = tile % 3;
        const row = Math.floor(tile / 3);
        ctx.drawImage(img, col * 40, row * 40, 40, 40, 0, 0, 40, 40);
      });
    };

    img.addEventListener('load', async () => {
      await run();
    });

    img.src = sprite;
  }, [generator]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <canvas
        onClick={() => {
          updateFlipper(!flipper);
        }}
        style={{
          cursor: 'pointer',
          imageRendering: 'pixelated',
          width: '100%',
        }}
        width="40"
        height="40"
        ref={canvas}
      />
    </div>
  );
});
