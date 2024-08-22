export type AvatarProps = {
  src: string;
  alt: string;
};

export default function Avatar(props: AvatarProps) {
  return (
    <img
      className="w-5 h-5 rounded-full object-cover"
      src={props.src}
      alt={props.alt}
    />
  );
}
