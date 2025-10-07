import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Documentation() {
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/Documentation.md")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");
        // Safely find first non-empty line as title
        const firstLine = lines.find((l) => l.trim().length > 0) || "";
        setTitle(firstLine.replace(/^\s*\*\*(.*?)\*\*\s*$/, "$1").trim());

        // Find the rest, skipping the title line
        const rest = lines.slice(lines.indexOf(firstLine) + 1).join("\n");

        const stepHeadingRegex = /^\*\*Step \d+:.*\*\*$/gm;
        let idxs = [];
        let match;
        while ((match = stepHeadingRegex.exec(rest))) {
          idxs.push(match.index);
        }

        if (idxs.length === 0) {
          idxs = [0];
        }

        const blocks = [];
        for (let i = 0; i < idxs.length; i++) {
          const start = idxs[i];
          const end = i + 1 < idxs.length ? idxs[i + 1] : rest.length;
          blocks.push(rest.slice(start, end).trimEnd());
        }

        setCards(blocks);
      });
  }, []);

  // Split by subheading like "6A." for Step 6 and above items
  // function splitBySubheadings(text) {
  //   const regex = /(\d+\s?[A-Z]\..+?)(?=(\n\d+\s?[A-Z]\.|$))/gs;
  //   let matches = [];
  //   let match;
  //   while ((match = regex.exec(text)) !== null) {
  //     matches.push(match[1].trim());
  //   }
  //   return matches;
  // }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "90vh",
        background: "var(--background)",
      }}
    >
      <div className="centered-container">
        <h1 style={{ marginBottom: 20, fontWeight: "bold" }}>{title}</h1>
        {cards.length === 0 && <p>Loading...</p>}

        {cards.map((md, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "var(--card)",
              borderRadius: 14,
              boxShadow: "0 4px 28px rgba(0,0,0,0.11)",
              marginBottom: 32,
              padding: 32,
              border: "1px solid var(--border)",
              maxWidth: 700,
              minWidth: 340,
              color: "var(--foreground)",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ ...props }) => (
                  <img
                    {...props}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "5px",
                      margin: "16px 0",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul
                    style={{
                      listStyleType: "disc",
                      paddingLeft: 24,
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                    {...props}
                  />
                ),
                ol: ({ ...props }) => (
                  <ol
                    style={{
                      listStyleType: "decimal",
                      paddingLeft: 24,
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                    {...props}
                  />
                ),
                li: ({ ...props }) => (
                  <li
                    style={{
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                    {...props}
                  />
                ),
              }}
            >
              {md}
            </ReactMarkdown>

            {/* Images for each card individually */}
            {idx === 0 && (
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <img
                  src="/images/doc1.svg"
                  alt="Step 1 image1"
                  style={{ maxWidth: 550 }}
                />
                <img
                  src="/images/doc2.svg"
                  alt="Step 1 image2"
                  style={{ maxWidth: 550 }}
                />
                <img
                  src="/images/doc3.svg"
                  alt="Step 1 image2"
                  style={{ maxWidth: 550 }}
                />
              </div>
            )}

            {idx === 1 && (
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <img
                  src="/images/step2.jpg"
                  alt="Step 2 image1"
                  style={{ maxWidth: 550, borderRadius: 5 }}
                />
              </div>
            )}

            {idx === 2 && (
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <img
                  src="/images/step3.jpg"
                  alt="Step 3 image1"
                  style={{ maxWidth: 550, borderRadius: 5 }}
                />
              </div>
            )}

            {idx === 3 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 20,
                }}
              >
                <img
                  src="/images/step4.jpg"
                  alt="Step 4 image1"
                  style={{ maxWidth: 550, borderRadius: 5 }}
                />
                <img
                  src="/images/step4(2).jpg"
                  alt="Step 4 image2"
                  style={{ maxWidth: 550, borderRadius: 5 }}
                />
              </div>
            )}

            {idx === 4 && (
              <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
                <img
                  src="/images/step5.jpg"
                  alt="Step 5 image1"
                  style={{ maxWidth: 550, borderRadius: 5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
