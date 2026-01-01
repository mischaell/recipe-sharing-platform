"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  tags: string[];
  cuisine?: string;
}

export default function RecipeCard({
  id,
  title,
  description,
  author,
  authorId,
  imageUrl,
  prepTime,
  cookTime,
  servings,
  difficulty,
  tags,
  cuisine,
}: RecipeCardProps) {
  const totalTime = prepTime + cookTime;
  const router = useRouter();

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/u/${authorId}`);
  };

  return (
    <Link
      href={`/recipes/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-orange-600">
            {title}
          </h3>
          {cuisine && (
            <span className="shrink-0 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
              {cuisine}
            </span>
          )}
        </div>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>
        <div className="mt-auto space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{totalTime} min</span>
            <span>•</span>
            <span>{servings} servings</span>
            <span>•</span>
            <span className="capitalize">{difficulty}</span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-500">+{tags.length - 3}</span>
              )}
            </div>
          )}
          <div className="pt-2">
            <button
              onClick={handleAuthorClick}
              className="text-xs font-medium text-gray-600 hover:text-orange-600"
            >
              By {author}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
