export default function HtmlView() {
  return (
    <iframe
      src="/xg_op_map.html"
      title="ML Output"
      style={{ width: "100%", height: "76vh", border: "none" }}
      sandbox="allow-scripts"
    />
  );
}
