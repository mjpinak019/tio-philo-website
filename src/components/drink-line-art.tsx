import type { DrinkPhoto } from "@/lib/site";

// Each drawing follows one continuous path in the same 120 × 140 canvas.
const drinkPaths: Record<DrinkPhoto["illustration"], string> = {
  coffee:
    "M18 110 C38 119 82 119 102 110 C84 108 36 108 18 110 C26 110 31 108 34 104 C23 99 23 78 23 64 C23 56 87 56 87 64 C87 72 23 72 23 64 C25 80 25 100 43 105 C59 110 78 105 83 93 C87 84 87 70 87 66 C109 62 107 90 85 88 C93 84 98 80 97 74 C96 67 82 65 74 60 C62 52 54 50 56 42 C58 34 70 32 68 23 C67 18 62 15 59 13",
  creamy:
    "M34 44 L42 112 Q60 120 78 112 L86 44 C84 36 36 36 34 44 C34 51 86 51 86 44 C86 37 34 37 34 44 L37 64 C52 73 68 58 83 65 L78 102 C66 108 53 108 42 102 L38 74 C48 68 55 84 62 76 C69 68 75 75 82 70 L77 48 L78 23 L94 17",
  refreshing:
    "M26 49 L37 116 Q61 122 84 116 L95 49 C89 44 31 44 26 49 C31 57 89 57 95 49 L91 71 C75 65 48 77 30 69 L35 91 L47 84 L55 96 L43 103 L35 91 L40 112 Q60 117 79 112 L85 86 L73 80 L65 92 L77 100 L85 86 L90 62 L79 54 L73 26 L59 19 C42 13 28 26 33 40 C36 50 49 55 60 49 C72 42 72 28 61 21 L49 35 L34 39 L49 35 L48 18",
};

export function DrinkLineArt({ kind }: { kind: DrinkPhoto["illustration"] }) {
  return (
    <svg className="drink-line-art" viewBox="0 0 120 140" fill="none" aria-hidden="true">
      <path d={drinkPaths[kind]} />
    </svg>
  );
}
