import Image from "next/image";
import emblem from "../../public/brand/tio-philo-emblem.png";
import darkEmblem from "../../public/brand/tio-philo-emblem-dark.jpg";

export function BrandLogo({ large = false }: { large?: boolean }) {
  return (
    <span className={`brand-logo${large ? " brand-logo-large" : ""}`}>
      <Image
        src={large ? darkEmblem : emblem}
        alt="Tio Philo Coffee Corner emblem"
        sizes={large ? "(max-width: 700px) 425px, 570px" : "90px"}
        preload={large}
      />
    </span>
  );
}
