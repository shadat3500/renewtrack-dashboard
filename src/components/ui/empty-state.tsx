export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">{icon}</span>
      <h3 className="text-h3 font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 max-w-sm text-body text-neutral-500">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
