export default function Title({
  title,
  subtitle,
  children,
  icon,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-row justify-between items-center gap-1">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          {icon}
          {title}
        </h1>
        {subtitle && <p className="text-base-content/70">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
