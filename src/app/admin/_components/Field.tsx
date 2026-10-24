import { inputClass } from "./styles";

export function Field({
  label,
  name,
  defaultValue,
  error,
  hint,
  type = "text",
  multiline,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  error?: string;
  hint?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const props = {
    id: name,
    name,
    defaultValue: defaultValue ?? "",
    required,
    placeholder,
    "aria-invalid": error ? true : undefined,
    className: inputClass,
  };

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {multiline ? <textarea rows={4} {...props} /> : <input type={type} {...props} />}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
