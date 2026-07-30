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
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full bg-accent-100 font-medium text-accent-600 ${sizeClasses}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
