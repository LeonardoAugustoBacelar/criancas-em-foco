const TAG_COLORS = {
  accent: "bg-accent-100 text-accent-600",
  warm: "bg-warm-100 text-warm-600",
  sky: "bg-sky-100 text-sky-600",
  sun: "bg-sun-100 text-sun-600",
  grass: "bg-grass-100 text-grass-600",
} as const;

const COLOR_CYCLE = Object.keys(TAG_COLORS) as (keyof typeof TAG_COLORS)[];

const KEYWORD_COLORS: { match: string; color: keyof typeof TAG_COLORS }[] = [
  { match: "tdah", color: "sun" },
  { match: "tea", color: "sky" },
  { match: "birra", color: "warm" },
  { match: "ansiedade", color: "grass" },
  { match: "escolar", color: "accent" },
  { match: "emocional", color: "grass" },
];

function colorForTag(tag: string, index: number): keyof typeof TAG_COLORS {
  const normalized = tag.toLowerCase();
  const found = KEYWORD_COLORS.find((entry) => normalized.includes(entry.match));
  return found ? found.color : COLOR_CYCLE[index % COLOR_CYCLE.length];
}

export default function SpecialtyTags({
  specialties,
  size = "sm",
}: {
  specialties: string;
  size?: "sm" | "md";
}) {
  const tags = specialties
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (tags.length === 0) return null;

  const sizeClasses =
    size === "md"
      ? "px-3 py-1 text-xs"
      : "px-2.5 py-0.5 text-[11px]";

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, index) => (
        <span
          key={tag}
          className={`rounded-full font-medium ${TAG_COLORS[colorForTag(tag, index)]} ${sizeClasses}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
