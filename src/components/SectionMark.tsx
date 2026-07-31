export type MarkColor = "accent" | "warm" | "sky" | "sun" | "grass";

const MARK_BG: Record<MarkColor, string> = {
  accent: "bg-accent-500",
  warm: "bg-warm-500",
  sky: "bg-sky-500",
  sun: "bg-sun-500",
  grass: "bg-grass-500",
};

export default function SectionMark({
  color,
  align = "center",
}: {
  color: MarkColor;
  align?: "center" | "left";
}) {
  return (
    <span
      className={`mt-3 block h-1.5 w-12 rounded-full ${MARK_BG[color]} ${align === "center" ? "mx-auto" : ""}`}
    />
  );
}
