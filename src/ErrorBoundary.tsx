import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string }
> {
  state = { error: "" };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    if (this.state.error)
      return (
        <main className="error-page">
          <h1>Tiệm cần khởi động lại một chút</h1>
          <p style={{ margin: "18px 0" }}>
            Một lỗi hiển thị đã dừng giao diện. Bản lưu gần nhất và bản dự phòng
            vẫn nằm trên thiết bị.
          </p>
          <p className="warning">{this.state.error}</p>
          <button className="btn primary" onClick={() => location.reload()}>
            Tải lại tiệm từ bản lưu
          </button>
        </main>
      );
    return this.props.children;
  }
}
