"use client";

import Sidebar from "../components/Sidebar";
import LIHeader from "../components/LIHeader";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "flashcards" | "questions" | "summary";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface MCQOption {
  label: string;
  correct: boolean;
}

interface Question {
  id: string;
  type: "mcq" | "open";
  question: string;
  options?: MCQOption[];
  answer: string;
}

interface Topic {
  id: string;
  title: string;
  emoji: string;
  color: string;
  createdAt: string;
  flashcards: Flashcard[];
  questions: Question[];
  summary: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_TOPICS: Topic[] = [
  {
    id: "tp1",
    title: "Database Normalisation",
    emoji: "🗄️",
    color: "#7c3aed",
    createdAt: "26 May 2026",
    summary: `Database normalisation is the process of organising a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured relations based on a series of normal forms.

**First Normal Form (1NF)** requires that each column contains atomic (indivisible) values and each row is unique. There should be no repeating groups or arrays within a column.

**Second Normal Form (2NF)** builds on 1NF by ensuring every non-key attribute is fully functionally dependent on the entire primary key — eliminating partial dependencies. This only applies to tables with composite primary keys.

**Third Normal Form (3NF)** extends 2NF by removing transitive dependencies — non-key attributes must depend only on the primary key, not on other non-key attributes.

**Boyce-Codd Normal Form (BCNF)** is a stricter version of 3NF. Every determinant must be a candidate key.

Normalisation trades some query performance for data integrity. Denormalisation is sometimes used deliberately in read-heavy systems for performance.`,
    flashcards: [
      { id: "f1", front: "What is the main goal of database normalisation?", back: "To reduce data redundancy and improve data integrity by organising tables into well-structured relations." },
      { id: "f2", front: "What does 1NF require?", back: "Each column must contain atomic values, each row must be unique, and there must be no repeating groups." },
      { id: "f3", front: "What is a partial dependency?", back: "When a non-key attribute depends on only part of a composite primary key — this violates 2NF." },
      { id: "f4", front: "What is a transitive dependency?", back: "When a non-key attribute depends on another non-key attribute rather than the primary key — this violates 3NF." },
      { id: "f5", front: "How does BCNF differ from 3NF?", back: "BCNF is stricter — every determinant must be a candidate key, whereas 3NF allows some exceptions." },
      { id: "f6", front: "What is denormalisation?", back: "The deliberate introduction of redundancy into a database design to improve read performance at the cost of data integrity." },
    ],
    questions: [
      { id: "q1", type: "mcq", question: "Which normal form eliminates partial dependencies?", options: [{ label: "1NF", correct: false }, { label: "2NF", correct: true }, { label: "3NF", correct: false }, { label: "BCNF", correct: false }], answer: "2NF eliminates partial dependencies, which occur when a non-key attribute depends on only part of a composite primary key." },
      { id: "q2", type: "mcq", question: "A table is in 3NF if it is in 2NF and has no:", options: [{ label: "Repeating groups", correct: false }, { label: "Composite keys", correct: false }, { label: "Transitive dependencies", correct: true }, { label: "Foreign keys", correct: false }], answer: "3NF removes transitive dependencies — where non-key attributes depend on other non-key attributes." },
      { id: "q3", type: "open", question: "Explain the difference between 2NF and 3NF in your own words.", answer: "2NF removes partial dependencies (attributes depending on part of a composite key). 3NF goes further and removes transitive dependencies (attributes depending on other non-key attributes)." },
      { id: "q4", type: "mcq", question: "Which statement about BCNF is correct?", options: [{ label: "It is weaker than 3NF", correct: false }, { label: "It requires every determinant to be a candidate key", correct: true }, { label: "It only applies to tables with no foreign keys", correct: false }, { label: "It eliminates all redundancy", correct: false }], answer: "BCNF requires that every determinant must be a candidate key, making it stricter than 3NF." },
      { id: "q5", type: "open", question: "Why might a developer choose to denormalise a database?", answer: "To improve read performance in read-heavy systems by reducing the number of joins needed, at the cost of some data redundancy and potential integrity issues." },
    ],
  },
  {
    id: "tp2",
    title: "Big O Notation",
    emoji: "📈",
    color: "#06b6d4",
    createdAt: "24 May 2026",
    summary: `Big O notation is a mathematical notation used to describe the upper bound of an algorithm's time or space complexity as the input size grows. It expresses the worst-case growth rate, ignoring constants and lower-order terms.

**O(1) — Constant time**: The algorithm takes the same time regardless of input size. Example: accessing an array element by index.

**O(log n) — Logarithmic time**: Time grows logarithmically. Common in divide-and-conquer algorithms like binary search.

**O(n) — Linear time**: Time grows proportionally to input size. Example: iterating through an array once.

**O(n log n) — Linearithmic time**: Common in efficient sorting algorithms like Merge Sort and Heap Sort.

**O(n²) — Quadratic time**: Time grows with the square of input size. Common in nested loops. Example: Bubble Sort.

**O(2ⁿ) — Exponential time**: Time doubles with each addition to input. Seen in naive recursive solutions like Fibonacci.

When comparing algorithms, Big O helps choose the most efficient solution for large inputs, even if a "slower" algorithm performs better on small inputs.`,
    flashcards: [
      { id: "f7", front: "What does Big O notation describe?", back: "The upper bound (worst case) of an algorithm's time or space complexity as input size grows." },
      { id: "f8", front: "What is O(1)?", back: "Constant time — the operation takes the same time regardless of input size. Example: array index access." },
      { id: "f9", front: "What is O(log n)?", back: "Logarithmic time — time grows logarithmically with input. Example: binary search." },
      { id: "f10", front: "Which sorting algorithms run in O(n log n)?", back: "Merge Sort, Heap Sort, and Quick Sort (average case)." },
      { id: "f11", front: "What makes an algorithm O(n²)?", back: "Typically nested loops where each loop iterates over n elements. Example: Bubble Sort, Selection Sort." },
    ],
    questions: [
      { id: "q6", type: "mcq", question: "What is the time complexity of binary search?", options: [{ label: "O(1)", correct: false }, { label: "O(n)", correct: false }, { label: "O(log n)", correct: true }, { label: "O(n²)", correct: false }], answer: "Binary search is O(log n) because it halves the search space with each comparison." },
      { id: "q7", type: "open", question: "Why do we ignore constants in Big O notation?", answer: "Because Big O describes asymptotic behaviour — how the algorithm scales for very large inputs. Constants become negligible as n grows towards infinity." },
      { id: "q8", type: "mcq", question: "Which complexity grows fastest?", options: [{ label: "O(n log n)", correct: false }, { label: "O(n²)", correct: false }, { label: "O(2ⁿ)", correct: true }, { label: "O(n³)", correct: false }], answer: "O(2ⁿ) exponential growth is faster than polynomial growth for large n." },
    ],
  },
  {
    id: "tp3",
    title: "React Hooks",
    emoji: "⚛️",
    color: "#10b981",
    createdAt: "22 May 2026",
    summary: `React Hooks are functions introduced in React 16.8 that let you use state and other React features in functional components, without writing class components.

**useState** lets you add state to a functional component. It returns a state value and a setter function. Calling the setter triggers a re-render.

**useEffect** lets you perform side effects — data fetching, subscriptions, DOM manipulation — after render. It accepts a dependency array; an empty array means it runs once on mount.

**useRef** gives you a mutable ref object that persists across renders without causing re-renders. Used for DOM access and storing mutable values.

**useCallback** memoises a function reference so it doesn't change between renders unless its dependencies change. Useful for preventing unnecessary child re-renders.

**useMemo** memoises a computed value. Only recalculates when dependencies change, useful for expensive calculations.

**useContext** lets you consume a React Context without wrapping in a Consumer component.

Custom hooks let you extract and reuse stateful logic across components. They follow the naming convention \`use[Name]\`.`,
    flashcards: [
      { id: "f12", front: "What problem did React Hooks solve?", back: "They allow functional components to use state and lifecycle features, removing the need for class components." },
      { id: "f13", front: "What does useState return?", back: "An array with two items: the current state value and a setter function that triggers re-render when called." },
      { id: "f14", front: "What is the dependency array in useEffect?", back: "An optional array of values. The effect re-runs only when these values change. An empty array [] means run only on mount." },
      { id: "f15", front: "When would you use useCallback?", back: "When passing a function to a child component to prevent the function reference from changing on every render, avoiding unnecessary re-renders." },
    ],
    questions: [
      { id: "q9", type: "mcq", question: "What happens when you call a useState setter with a new value?", options: [{ label: "The component unmounts", correct: false }, { label: "The component re-renders", correct: true }, { label: "The DOM is directly updated", correct: false }, { label: "Nothing until next tick", correct: false }], answer: "Calling a useState setter triggers a re-render of the component with the new state value." },
      { id: "q10", type: "open", question: "Explain the difference between useCallback and useMemo.", answer: "useCallback memoises a function reference so it stays stable across renders. useMemo memoises a computed value. Both accept dependency arrays and only update when dependencies change." },
      { id: "q11", type: "mcq", question: "Which hook would you use to directly access a DOM element?", options: [{ label: "useState", correct: false }, { label: "useEffect", correct: false }, { label: "useRef", correct: true }, { label: "useContext", correct: false }], answer: "useRef returns a mutable ref object whose .current property can hold a reference to a DOM element." },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 9); }

// ─── Flashcard component ──────────────────────────────────────────────────────
function FlashcardItem({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(f => !f)}
      style={{
        perspective: 1000,
        height: 160,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Front */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: "#0a0a2e",
          border: "1px solid rgba(74,74,232,0.2)",
          borderRadius: 12,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "18px 20px", textAlign: "center",
          gap: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4a4a7a", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Question</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ff", lineHeight: 1.55 }}>{card.front}</div>
          <div style={{ fontSize: 10, color: "#4a4a7a", marginTop: 4 }}>Click to reveal →</div>
        </div>

        {/* Back */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "rgba(74,74,232,0.12)",
          border: "1px solid rgba(74,74,232,0.35)",
          borderRadius: 12,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "18px 20px", textAlign: "center",
          gap: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#6b6bf0", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace" }}>Answer</div>
          <div style={{ fontSize: 13, color: "#e8e8ff", lineHeight: 1.55 }}>{card.back}</div>
          <div style={{ fontSize: 10, color: "#6b6bf0", marginTop: 4 }}>Click to flip back ↩</div>
        </div>
      </div>
    </div>
  );
}

// ─── MCQ Question ─────────────────────────────────────────────────────────────
function MCQQuestion({ q }: { q: Question }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(74,74,232,0.15)", color: "#6b6bf0", fontFamily: "monospace", flexShrink: 0, marginTop: 1 }}>MCQ</span>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ff", lineHeight: 1.55 }}>{q.question}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options!.map((opt, i) => {
          const isSelected = selected === i;
          const showResult = answered;
          const isCorrect = opt.correct;

          let bg = "#0f0f3a";
          let border = "rgba(74,74,232,0.15)";
          let color = "#8888bb";

          if (showResult) {
            if (isCorrect) { bg = "rgba(52,211,153,0.1)"; border = "rgba(52,211,153,0.35)"; color = "#34d399"; }
            else if (isSelected && !isCorrect) { bg = "rgba(251,113,133,0.1)"; border = "rgba(251,113,133,0.3)"; color = "#fb7185"; }
          } else if (isSelected) {
            bg = "rgba(74,74,232,0.15)"; border = "rgba(74,74,232,0.4)"; color = "#a78bfa";
          }

          return (
            <div
              key={i}
              onClick={() => !answered && setSelected(i)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 9,
                background: bg, border: `1px solid ${border}`,
                cursor: answered ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color,
              }}>
                {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✕" : String.fromCharCode(65 + i)}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color }}>{opt.label}</span>
            </div>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 9, background: "rgba(74,74,232,0.07)", border: "1px solid rgba(74,74,232,0.15)", fontSize: 12, color: "#8888bb", lineHeight: 1.55 }}>
          💡 {q.answer}
        </div>
      )}
    </div>
  );
}

// ─── Open Question ────────────────────────────────────────────────────────────
function OpenQuestion({ q }: { q: Question }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 12, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "rgba(167,139,250,0.15)", color: "#a78bfa", fontFamily: "monospace", flexShrink: 0, marginTop: 1 }}>Open</span>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8ff", lineHeight: 1.55 }}>{q.question}</div>
      </div>
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            background: "rgba(74,74,232,0.1)", border: "1px solid rgba(74,74,232,0.2)",
            color: "#6b6bf0", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.15s",
          }}
        >Show suggested answer →</button>
      ) : (
        <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(74,74,232,0.07)", border: "1px solid rgba(74,74,232,0.15)", fontSize: 12, color: "#8888bb", lineHeight: 1.55 }}>
          💡 {q.answer}
        </div>
      )}
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────
function Summary({ text }: { text: string }) {
  const paragraphs = text.trim().split("\n\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {paragraphs.map((para, i) => {
        // Detect **bold** inline and render it
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} style={{ fontSize: 13, color: "#c4c4e8", lineHeight: 1.75, margin: 0 }}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} style={{ color: "#e8e8ff", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

// ─── Topic Detail View ────────────────────────────────────────────────────────
function TopicDetail({ topic, onBack }: { topic: Topic; onBack: () => void }) {
  const [tab, setTab] = useState<TabType>("flashcards");
  const [fcIndex, setFcIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "one">("grid");

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "flashcards", label: "Flashcards", icon: "🃏" },
    { key: "questions",  label: "Questions",  icon: "❓" },
    { key: "summary",    label: "Summary",    icon: "📋" },
  ];

  const mcqs  = topic.questions.filter(q => q.type === "mcq");
  const opens = topic.questions.filter(q => q.type === "open");

  return (
    <div>
      {/* Back + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 9,
            background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
            color: "#8888bb", fontSize: 12, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#e8e8ff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,74,232,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#8888bb"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,74,232,0.15)"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: topic.color + "33",
            border: `1px solid ${topic.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>{topic.emoji}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#e8e8ff" }}>{topic.title}</div>
            <div style={{ fontSize: 11, color: "#4a4a7a", marginTop: 2, fontFamily: "monospace" }}>
              Generated {topic.createdAt} · {topic.flashcards.length} cards · {topic.questions.length} questions
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 11, padding: 4, width: "fit-content" }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8,
              background: tab === t.key ? "#4a4ae8" : "transparent",
              border: "none",
              color: tab === t.key ? "#fff" : "#8888bb",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", transition: "all 0.2s",
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Flashcards tab ── */}
      {tab === "flashcards" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#4a4a7a", fontFamily: "monospace" }}>
              {topic.flashcards.length} cards · click to flip
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["grid", "one"] as const).map(m => (
                <button key={m} onClick={() => { setViewMode(m); setFcIndex(0); }} style={{
                  padding: "5px 12px", borderRadius: 7,
                  background: viewMode === m ? "rgba(74,74,232,0.2)" : "transparent",
                  border: `1px solid ${viewMode === m ? "rgba(74,74,232,0.4)" : "rgba(74,74,232,0.15)"}`,
                  color: viewMode === m ? "#a78bfa" : "#4a4a7a",
                  fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                }}>{m === "grid" ? "Grid" : "One by one"}</button>
              ))}
            </div>
          </div>

          {viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {topic.flashcards.map(card => <FlashcardItem key={card.id} card={card} />)}
            </div>
          ) : (
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <FlashcardItem key={topic.flashcards[fcIndex].id + fcIndex} card={topic.flashcards[fcIndex]} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
                <button onClick={() => setFcIndex(i => Math.max(0, i - 1))} disabled={fcIndex === 0} style={{ padding: "8px 18px", borderRadius: 9, background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", color: fcIndex === 0 ? "#4a4a7a" : "#8888bb", fontSize: 12, fontWeight: 700, cursor: fcIndex === 0 ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif" }}>← Prev</button>
                <span style={{ fontSize: 12, color: "#4a4a7a", fontFamily: "monospace" }}>{fcIndex + 1} / {topic.flashcards.length}</span>
                <button onClick={() => setFcIndex(i => Math.min(topic.flashcards.length - 1, i + 1))} disabled={fcIndex === topic.flashcards.length - 1} style={{ padding: "8px 18px", borderRadius: 9, background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", color: fcIndex === topic.flashcards.length - 1 ? "#4a4a7a" : "#8888bb", fontSize: 12, fontWeight: 700, cursor: fcIndex === topic.flashcards.length - 1 ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif" }}>Next →</button>
              </div>
              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
                {topic.flashcards.map((_, i) => (
                  <div key={i} onClick={() => setFcIndex(i)} style={{ width: 7, height: 7, borderRadius: "50%", cursor: "pointer", background: i === fcIndex ? "#4a4ae8" : "rgba(74,74,232,0.2)", transition: "background 0.2s" }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Questions tab ── */}
      {tab === "questions" && (
        <div>
          {mcqs.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4a4a7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Multiple Choice · {mcqs.length} questions
              </div>
              {mcqs.map(q => <MCQQuestion key={q.id} q={q} />)}
            </div>
          )}
          {opens.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4a4a7a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Open Questions · {opens.length} questions
              </div>
              {opens.map(q => <OpenQuestion key={q.id} q={q} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Summary tab ── */}
      {tab === "summary" && (
        <div style={{ background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)", borderRadius: 14, padding: "24px 28px", maxWidth: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(74,74,232,0.1)" }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#e8e8ff" }}>AI-Generated Summary</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(74,74,232,0.15)", color: "#6b6bf0", fontFamily: "monospace", marginLeft: 4 }}>✦ AI</span>
          </div>
          <Summary text={topic.summary} />
        </div>
      )}
    </div>
  );
}

// ─── Topic Card (grid view) ───────────────────────────────────────────────────
function TopicCard({ topic, onClick }: { topic: Topic; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
        borderRadius: 14, padding: "18px 20px", cursor: "pointer",
        transition: "all 0.2s", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(74,74,232,0.35)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(74,74,232,0.15)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Glow */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: topic.color, opacity: 0.07, pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: topic.color + "28",
          border: `1px solid ${topic.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{topic.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#e8e8ff", letterSpacing: "-0.01em", marginBottom: 4 }}>{topic.title}</div>
          <div style={{ fontSize: 10, color: "#4a4a7a", fontFamily: "monospace" }}>Generated {topic.createdAt}</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: `${topic.flashcards.length} flashcards`, icon: "🃏" },
          { label: `${topic.questions.length} questions`, icon: "❓" },
          { label: "Summary", icon: "📋" },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "4px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600,
            background: "rgba(74,74,232,0.1)", border: "1px solid rgba(74,74,232,0.15)",
            color: "#8888bb",
          }}>
            <span style={{ fontSize: 11 }}>{s.icon}</span> {s.label}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div style={{ position: "absolute", bottom: 18, right: 20, color: "#4a4a7a", fontSize: 14 }}>→</div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>📚</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#e8e8ff", marginBottom: 8 }}>No study notes yet</div>
      <div style={{ fontSize: 13, color: "#4a4a7a", lineHeight: 1.6, maxWidth: 340, marginBottom: 24 }}>
        Upload your lecture notes in the AI Assistant and it will automatically generate flashcards, questions, and a summary here.
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 18px", borderRadius: 10,
        background: "rgba(74,74,232,0.12)", border: "1px solid rgba(74,74,232,0.25)",
        color: "#a78bfa", fontSize: 12, fontWeight: 700,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Go to AI Assistant to scan notes
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Notes() {
  const [topics] = useState<Topic[]>(DUMMY_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [search, setSearch] = useState("");

  const filtered = topics.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,74,232,0.2); border-radius: 2px; }
        .search-input::placeholder { color: #4a4a7a; }
        .search-input:focus { border-color: rgba(74,74,232,0.45) !important; outline: none; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" style={{ background: "#050510" }}>
          <LIHeader pageName="Notes" pageDesc={`${topics.length} topics generated by AI`} />

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto" style={{ padding: 24, color: "#e8e8ff", position: "relative" }}>

            {/* Background glow */}
            <div style={{ position: "fixed", top: -150, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, rgba(74,74,232,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ position: "relative", zIndex: 1 }}>

              {selectedTopic ? (
                <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
              ) : (
                <>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em" }}>Study Notes</h1>
                      <p style={{ fontSize: 12, color: "#4a4a7a", marginTop: 4, fontFamily: "monospace" }}>
                        {topics.length} topics · generated by AI from your lecture notes
                      </p>
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a4a7a" strokeWidth="2.5" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Search topics..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                          background: "#0a0a2e", border: "1px solid rgba(74,74,232,0.15)",
                          borderRadius: 10, padding: "9px 14px 9px 34px",
                          color: "#e8e8ff", fontFamily: "'Outfit',sans-serif",
                          fontSize: 12, width: 220, transition: "border-color 0.2s",
                        }}
                      />
                    </div>
                  </div>

                  {/* Info banner */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderRadius: 10, background: "rgba(74,74,232,0.07)", border: "1px solid rgba(74,74,232,0.15)", marginBottom: 24, fontSize: 12, color: "#8888bb" }}>
                    <span style={{ color: "#6b6bf0", fontSize: 14 }}>✦</span>
                    Topics are automatically created when you scan lecture notes in the <strong style={{ color: "#a78bfa" }}>AI Assistant</strong>. Each topic includes flashcards, questions, and a summary.
                  </div>

                  {/* Grid or empty */}
                  {filtered.length === 0 && search ? (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "#4a4a7a", fontSize: 13 }}>
                      No topics matching &quot;{search}&quot;
                    </div>
                  ) : topics.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                      {filtered.map(topic => (
                        <TopicCard key={topic.id} topic={topic} onClick={() => setSelectedTopic(topic)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}