import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Video } from "lucide-react";
import RatingStars from "@/components/RatingStars";
import SpecialtyTags from "@/components/SpecialtyTags";
import { summarizeRatings } from "@/lib/reviews";

type TeacherCardData = {
  id: string;
  photoUrl: string | null;
  specialties: string;
  bio: string;
  pricePerHour: number;
  user: { name: string };
  reviews: { rating: number }[];
};

export default function TeacherCard({
  teacher,
  index = 0,
}: {
  teacher: TeacherCardData;
  index?: number;
}) {
  const ratingSummary = summarizeRatings(teacher.reviews);

  return (
    <Link
      href={`/professoras/${teacher.id}`}
      data-reveal
      style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
      className="group flex flex-col overflow-hidden rounded-lg border border-primary-100 bg-white transition hover:shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-primary-100">
        {teacher.photoUrl ? (
          <Image
            src={teacher.photoUrl}
            alt={teacher.user.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-primary-500">
            {teacher.user.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-bold text-primary-700 group-hover:text-accent-600">
          {teacher.user.name}
        </p>
        <div className="mt-1">
          <RatingStars {...ratingSummary} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-primary-700/80">
          {teacher.bio}
        </p>

        <div className="mt-3">
          <SpecialtyTags specialties={teacher.specialties} max={3} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-primary-50 pt-3">
          {teacher.pricePerHour > 0 ? (
            <p className="text-sm font-semibold text-primary-600">
              R$ {teacher.pricePerHour.toFixed(2)} / hora
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-600">
            <Video className="h-3 w-3" />
            100% online
          </span>
        </div>
      </div>
    </Link>
  );
}
