import Image from "next/image";
import { DrinkLineArt } from "@/components/drink-line-art";
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
          <DrinkLineArt kind={photo.illustration} />
          <span>Drink photo coming soon</span>
        </div>
      )}
      <figcaption>{photo.label}</figcaption>
    </figure>
  );
}
