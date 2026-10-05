import type { ReactNode } from "react";
export function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      className={`icon ${className}`}
      src={`/assets/ui/${name}.svg`}
      width={size}
      height={size}
      alt=""
      draggable={false}
    />
  );
}
export function Button({
  children,
  icon,
  onClick,
  disabled = false,
  kind = "",
  title,
  type = "button",
}: {
  children?: ReactNode;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  kind?: string;
  title?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      className={`btn ${kind}`}
      onClick={onClick}
    >
      {icon && <Icon name={icon} />} {children}
    </button>
  );
}
export function Meter({
  value,
  label,
  tone = "green",
}: {
  value: number;
  label?: string;
  tone?: string;
}) {
  return (
    <div className="meter-wrap">
      {label && (
        <div className="meter-label">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
      )}
      <div
        className={`meter ${tone}`}
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
export function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="modal-backdrop"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-head">
          <div>
            <p className="eyebrow">MIU MATCHA · SỔ TIỆM</p>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-btn" aria-label="Đóng bảng" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}
export function Empty({
  icon = "leaf",
  children,
}: {
  icon?: string;
  children: ReactNode;
}) {
  return (
    <div className="empty">
      <Icon name={icon} size={46} />
      <p>{children}</p>
    </div>
  );
}
export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
