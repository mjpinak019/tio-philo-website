type SeasonalVariant = "hero" | "pine" | "ornaments";

function PineSprig() {
  return (
    <svg className="seasonal-pine" viewBox="0 0 220 180" fill="none" focusable="false">
      <path d="M18 168C60 137 110 88 193 19M68 127L57 75M97 101L94 44M125 77L140 30M96 103L157 103M65 131L125 138" />
      <path d="M59 86L43 76M61 97L41 87M63 108L44 99M65 118L48 111M94 57L80 43M95 70L77 56M96 83L80 71M97 94L83 84M137 40L130 24M132 52L124 35M128 65L120 49M109 103L119 89M123 103L135 88M139 103L151 92M77 133L89 120M91 135L105 123M106 137L119 126M167 41L167 21M156 50L155 30M146 59L143 42M160 47L180 49M148 57L167 60M136 67L155 72" />
      <circle cx="92" cy="116" r="4" />
      <circle cx="101" cy="123" r="3" />
    </svg>
  );
}

function HangingOrnaments() {
  return (
    <svg className="seasonal-hanging" viewBox="0 0 140 210" fill="none" focusable="false">
      <g className="seasonal-ornament">
        <path d="M37 0V65M31 65H43V72H31Z" />
        <circle cx="37" cy="94" r="23" />
        <path d="M37 77L41 90L54 94L41 98L37 111L33 98L20 94L33 90Z" />
      </g>
      <g className="seasonal-ornament seasonal-ornament-late">
        <path d="M104 0V113M99 113H109V120H99Z" />
        <circle cx="104" cy="139" r="20" />
        <path d="M88 128C98 135 110 135 120 128M85 139C98 146 110 146 123 139M89 151C99 155 109 155 119 151" />
      </g>
    </svg>
  );
}

function QuietStars() {
  return (
    <svg className="seasonal-stars" viewBox="0 0 180 160" fill="none" focusable="false">
      <g className="seasonal-star">
        <path d="M48 14L52 29L67 33L52 37L48 52L44 37L29 33L44 29Z" />
      </g>
      <g className="seasonal-star seasonal-star-late">
        <path d="M133 75L136 86L147 89L136 92L133 103L130 92L119 89L130 86Z" />
      </g>
      <g className="seasonal-star seasonal-star-last">
        <path d="M37 114V130M29 122H45M97 23V33M92 28H102" />
      </g>
    </svg>
  );
}

// Decorative server-rendered SVGs; CSS handles the slow looping motion.
export function SeasonalDecorations({ variant = "pine" }: { variant?: SeasonalVariant }) {
  return (
    <div className={`seasonal-decor seasonal-decor-${variant}`} aria-hidden="true">
      <PineSprig />
      <QuietStars />
      {variant !== "pine" && <HangingOrnaments />}
    </div>
  );
}
