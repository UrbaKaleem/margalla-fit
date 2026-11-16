import { useState } from "react";
import yoga from "../assets/classes/yoga.svg";
import hiit from "../assets/classes/hiit.svg";
import boxing from "../assets/classes/boxing.svg";
import pilates from "../assets/classes/pilates.svg";
import spin from "../assets/classes/spin.svg";
import strength from "../assets/classes/strength.svg";

const IMAGES = { yoga, hiit, boxing, pilates, spin, strength };

/** Class illustration with a text fallback when the image is missing or fails to load. */
export default function ClassImage({ record, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = IMAGES[record.image];

  if (!src || failed) {
    return (
      <div className={`class-image class-image--fallback ${className}`} role="img" aria-label={`No photo available for ${record.title}`}>
        <span aria-hidden="true">{record.type}</span>
      </div>
    );
  }

  return (
    <img
      className={`class-image ${className}`}
      src={src}
      alt={`Illustration of a ${record.type.toLowerCase()} class`}
      width="320"
      height="180"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
