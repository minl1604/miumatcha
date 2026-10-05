import manifest from "./assetsManifest.json";
const poses = (pose: string) =>
  /ngủ|nghỉ/.test(pose)
    ? "sleep"
    : /ngáp/.test(pose)
      ? "yawn"
      : /chui|hộp/.test(pose)
        ? "box"
        : /vồ|câu/.test(pose)
          ? "pounce"
          : /liếm/.test(pose)
            ? "lick"
            : /chạm tay|ngồi/.test(pose)
              ? "sit"
              : /ăn/.test(pose)
                ? "eat"
                : /dụi/.test(pose)
                  ? "rub"
                  : "idle";
export default function CatPhoto({
  index,
  pose,
  caption,
}: {
  index: number;
  pose: string;
  caption: string;
}) {
  const frame = Math.max(0, manifest.catStates.indexOf(poses(pose)));
  return (
    <svg
      viewBox="0 0 200 135"
      role="img"
      aria-label={caption}
      style={{ width: "100%", borderRadius: 9, background: "#eceddf" }}
    >
      <rect x="10" y="10" width="180" height="115" rx="9" fill="#f6f1de" />
      <rect
        x="21"
        y="18"
        width="56"
        height="47"
        rx="4"
        fill="#c6d8b6"
        stroke="#b7986c"
        strokeWidth="4"
      />
      <path d="M49 20v44M23 41h52" stroke="#b7986c" strokeWidth="3" />
      <path d="M10 77h180v42H10" fill="#dac59c" />
      <path d="M11 94h178M50 78v16M131 94v26" stroke="#c5ac83" />
      <ellipse cx="120" cy="110" rx="49" ry="10" fill="#aabb89" />
      <svg
        x="78"
        y="24"
        width="95"
        height="95"
        viewBox={`${frame * 84} 0 84 84`}
      >
        <image
          href={`/assets/cats/cat-${index}.svg`}
          width="1596"
          height="84"
        />
      </svg>
      <path
        d="M168 62q15-8 15 7q-14 5-15-7M175 73v20"
        fill="#90ad77"
        stroke="#748f62"
        strokeWidth="2"
      />
      <path d="M164 91h22l-4 17h-14z" fill="#ca9d77" />
    </svg>
  );
}
