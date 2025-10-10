import GraphicOne from "../assets/bgImage_sih.jpg";
import GraphicTwo from "../assets/logo_sih.jpg";

export default function AboutUsPage() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] w-full"
      style={{
        background:
          "linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top spacing to align with screenshot margins */}

        {/* Our Mission + Right Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Our Mission
            </h2>
            <p
              className="leading-6 text-sm md:text-base"
              style={{ color: "var(--muted-foreground)" }}
            >
              Our mission is to develop a reliable and accessible platform that
              helps monitor the Heavy Metal Indices (HMI) of groundwater. With
              the growing concern of water contamination, our goal is to support
              government bodies, researchers, and policymakers with accurate
              data-driven insights. This enables quick decision-making to ensure
              the availability of safe and clean water for communities across
              India.
            </p>
          </div>
          <div className="flex md:justify-end">
            <img
              src="/images/Gemini_Generated_Image_nab3hhnab3hhnab3.png"
              alt="Analytics dashboard illustration"
              className="w-full md:w-[420px] h-[220px] rounded-xl object-cover shadow-xl"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = GraphicOne;
              }}
            />
          </div>
        </div>

        {/* Spacer between sections */}
        <div className="h-12" />

        {/* Left Graphic + Our Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="flex">
            <img
              src="/images/pic1.png"
              alt="3D groundwater contamination illustration"
              className="w-full md:w-[420px] h-[220px] rounded-xl object-cover shadow-xl"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = GraphicTwo;
              }}
            />
          </div>
          <div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: "var(--foreground)" }}
            >
              Our Vision
            </h2>
            <p
              className="leading-6 text-sm md:text-base"
              style={{ color: "var(--muted-foreground)" }}
            >
              We envision a future where technology and environmental science
              work hand in hand to solve pressing challenges. Through our Heavy
              Metal Indices Analysis system, we aim to Safeguard public health
              by reducing risks of heavy metal contamination. Empower
              authorities with advanced predictive tools for water quality
              management. Promote sustainability by contributing to clean water
              initiatives and responsible resource management.
            </p>
          </div>
        </div>

        {/* Spacer before Team section */}
        <div className="h-67 md:h-40" />

        {/* Our Team */}
        <section>
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8"
            style={{ color: "var(--foreground)" }}
          >
            Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: "Nikunj Tangle", role: "Team Lead" },
              { name: "Arihant Kumar", role: "Member 1" },
              { name: "Snehal Chikane", role: "Member 2" },
              { name: "Jagdeep Singh", role: "Member 3" },
              { name: "Gourav Tiwari", role: "Member 4" },
              { name: "Balbir Singh", role: "Member 5" },
            ].map((member) => (
              <div key={member.name} className="flex flex-col items-center">
                <div
                  className="w-[220px] h-[220px] rounded-lg shadow-inner"
                  style={{
                    background: "linear-gradient(145deg, #B3CFE5, #4A7FA7)",
                  }}
                />
                <div className="mt-4 text-center">
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="-mt-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
