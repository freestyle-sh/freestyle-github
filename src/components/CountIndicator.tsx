export type CountIndicatorProps = {
  count: number;
};

export default function CountIndicator(props: CountIndicatorProps) {
  return (
    <div className="rounded-full flex items-center justify-center w-5 h-5 bg-white/10">
      {props.count}
    </div>
  );
}
