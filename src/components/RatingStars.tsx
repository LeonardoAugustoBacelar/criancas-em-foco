import { Star } from "lucide-react";

export default function RatingStars({
  average,
  count,
  size = "sm",
  hideLabel = false,
}: {
  average: number;
  count: number;
  size?: "sm" | "md";
  hideLabel?: boolean;
}) {
  if (count === 0) {
    return (
      <span className="text-xs text-primary-500">Ainda sem avaliações</span>
    );
  }

  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`${starSize} ${
              value <= Math.round(average)
                ? "fill-accent-500 text-accent-500"
                : "text-primary-100"
            }`}
          />
        ))}
      </div>
      {!hideLabel && (
        <span className="text-xs font-medium text-primary-600">
          {average.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
