import Image from "next/image";
import emblem from "../../public/brand/tio-philo-emblem.png";

export function BrandLogo({ large = false }: { large?: boolean }) {
  return (
    <span className={`brand-logo${large ? " brand-logo-large" : ""}`}>
      <Image
        src={emblem}
        alt="Tio Philo Coffee Corner emblem"
        sizes={large ? "(max-width: 700px) 450px, 620px" : "104px"}
        preload={large}
      />
    </span>
  );
}
