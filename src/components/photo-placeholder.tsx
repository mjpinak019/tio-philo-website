import Image from "next/image";
import { publicAssetPath } from "@/lib/paths";
import type { DrinkPhoto } from "@/lib/site";

export function PhotoPlaceholder({ photo }: { photo: DrinkPhoto }) {
  return (
    <figure className="drink-photo">
      {photo.src ? (
        <div className="photo-frame">
          <Image
            src={publicAssetPath(photo.src)}
            alt={photo.alt}
            fill
            sizes="(max-width: 700px) 85vw, 33vw"
          />
        </div>
      ) : (
        <div className="photo-frame photo-placeholder">
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M8 15h9l3-5h8l3 5h9v24H8z" />
            <circle cx="24" cy="26" r="8" />
            <path d="M34 20h2" />
          </svg>
          <span>Drink photo coming soon</span>
        </div>
      )}
      <figcaption>{photo.label}</figcaption>
    </figure>
  );
}
