import myBackgroundImage from "@/assets/bgimage_sih.png"; // Adjust the path as necessary
export default function HomePage() {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10,25,49,0.55) 0%, rgba(26,61,99,0.45) 30%, rgba(246,250,253,0.0) 70%), url(${myBackgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center"
    >
      <div
        className="text-center px-6 py-10 rounded-2xl"
        style={{
          background: "color-mix(in sRGB, var(--card) 85%, transparent)",
          border: "1px solid var(--border)",
          boxShadow: "0 12px 40px rgba(10,25,49,0.25)",
          backdropFilter: "blur(8px)",
          maxWidth: 860,
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-extrabold"
          style={{ color: "var(--foreground)" }}
        >
          Metal Gauge Analytics
        </h1>
        <p
          className="mt-4 text-lg"
          style={{ color: "var(--muted-foreground)" }}
        >
          Explore, compare, and visualize environmental metrics with a soothing
          blue interface.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/analysis/graphs"
            className="px-6 py-3 rounded-full text-white"
            style={{ background: "var(--accent)" }}
          >
            Get Started
          </a>
          <a
            href="/about-us"
            className="px-6 py-3 rounded-full"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
