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
      className="h-[160px] cursor-pointer select-none [perspective:1000px]"
    >
      <div
        className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-[#0a0a2e] border border-[rgba(74,74,232,0.2)] rounded-xl flex flex-col items-center justify-center p-[18px_20px] text-center gap-2.5 [backface-visibility:hidden]">
          <div className="text-[10px] font-bold text-[#4a4a7a] uppercase tracking-wide font-mono">Question</div>
          <div className="text-[13px] font-semibold text-[#e8e8ff] leading-relaxed">{card.front}</div>
          <div className="text-[10px] text-[#4a4a7a] mt-1">Click to reveal →</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-[rgba(74,74,232,0.12)] border border-[rgba(74,74,232,0.35)] rounded-xl flex flex-col items-center justify-center p-[18px_20px] text-center gap-2.5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="text-[10px] font-bold text-[#6b6bf0] uppercase tracking-wide font-mono">Answer</div>
          <div className="text-[13px] text-[#e8e8ff] leading-relaxed">{card.back}</div>
          <div className="text-[10px] text-[#6b6bf0] mt-1">Click to flip back ↩</div>
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
    <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-4 mb-3.5">
      <div className="flex items-start gap-2.5 mb-3.5">
        <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-[rgba(74,74,232,0.15)] text-[#6b6bf0] font-mono shrink-0 mt-px">MCQ</span>
        <div className="text-[13px] font-semibold text-[#e8e8ff] leading-relaxed">{q.question}</div>
      </div>
      <div className="flex flex-col gap-2">
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
              className="flex items-center gap-2.5 py-2.5 px-3.5 rounded-lg transition-all duration-200"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                cursor: answered ? "default" : "pointer",
              }}
            >
              <div
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
                style={{
                  border: `2px solid ${border}`,
                  color: color,
                }}
              >
                {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✕" : String.fromCharCode(65 + i)}
              </div>
              <span className="text-xs font-medium" style={{ color }}>{opt.label}</span>
            </div>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 p-2.5 rounded-lg bg-[rgba(74,74,232,0.07)] border border-[rgba(74,74,232,0.15)] text-xs text-[#8888bb] leading-relaxed">
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
    <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-4 mb-3.5">
      <div className="flex items-start gap-2.5 mb-3">
        <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-[rgba(167,139,250,0.15)] text-[#a78bfa] font-mono shrink-0 mt-px">Open</span>
        <div className="text-[13px] font-semibold text-[#e8e8ff] leading-relaxed">{q.question}</div>
      </div>
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="py-2 px-3.5 rounded-lg bg-[rgba(74,74,232,0.1)] border border-[rgba(74,74,232,0.2)] text-[#6b6bf0] text-xs font-semibold cursor-pointer transition-all duration-150 hover:bg-[rgba(74,74,232,0.2)]"
        >
          Show suggested answer →
        </button>
      ) : (
        <div className="p-2.5 rounded-lg bg-[rgba(74,74,232,0.07)] border border-[rgba(74,74,232,0.15)] text-xs text-[#8888bb] leading-relaxed">
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
    <div className="flex flex-col gap-3.5">
      {paragraphs.map((para, i) => {
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-[13px] text-[#c4c4e8] leading-relaxed m-0">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="text-[#e8e8ff] font-bold">{part.slice(2, -2)}</strong>;
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
      <div className="flex items-center gap-3.5 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] text-[#8888bb] text-xs font-bold cursor-pointer transition-all duration-150 hover:text-[#e8e8ff] hover:border-[rgba(74,74,232,0.3)]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ background: topic.color + "33", border: `1px solid ${topic.color}55` }}
          >
            {topic.emoji}
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight text-[#e8e8ff]">{topic.title}</div>
            <div className="text-[11px] text-[#4a4a7a] mt-0.5 font-mono">
              Generated {topic.createdAt} · {topic.flashcards.length} cards · {topic.questions.length} questions
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6 bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 ${
              tab === t.key
                ? "bg-[#4a4ae8] text-white"
                : "bg-transparent text-[#8888bb] hover:text-[#e8e8ff]"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Flashcards tab ── */}
      {tab === "flashcards" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-[#4a4a7a] font-mono">
              {topic.flashcards.length} cards · click to flip
            </div>
            <div className="flex gap-1.5">
              {(["grid", "one"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setViewMode(m); setFcIndex(0); }}
                  className={`py-1 px-3 rounded-md text-[11px] font-bold cursor-pointer transition-all ${
                    viewMode === m
                      ? "bg-[rgba(74,74,232,0.2)] border-[rgba(74,74,232,0.4)] text-[#a78bfa]"
                      : "bg-transparent border-[rgba(74,74,232,0.15)] text-[#4a4a7a]"
                  } border`}
                >
                  {m === "grid" ? "Grid" : "One by one"}
                </button>
              ))}
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
              {topic.flashcards.map(card => <FlashcardItem key={card.id} card={card} />)}
            </div>
          ) : (
            <div className="max-w-[520px] mx-auto">
              <FlashcardItem key={topic.flashcards[fcIndex].id + fcIndex} card={topic.flashcards[fcIndex]} />
              <div className="flex items-center justify-center gap-4 mt-5">
                <button
                  onClick={() => setFcIndex(i => Math.max(0, i - 1))}
                  disabled={fcIndex === 0}
                  className={`py-2 px-4.5 rounded-lg bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] text-xs font-bold font-['Outfit',sans-serif] transition-all ${
                    fcIndex === 0 ? "text-[#4a4a7a] cursor-not-allowed" : "text-[#8888bb] cursor-pointer hover:text-[#e8e8ff]"
                  }`}
                >
                  ← Prev
                </button>
                <span className="text-xs text-[#4a4a7a] font-mono">{fcIndex + 1} / {topic.flashcards.length}</span>
                <button
                  onClick={() => setFcIndex(i => Math.min(topic.flashcards.length - 1, i + 1))}
                  disabled={fcIndex === topic.flashcards.length - 1}
                  className={`py-2 px-4.5 rounded-lg bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] text-xs font-bold font-['Outfit',sans-serif] transition-all ${
                    fcIndex === topic.flashcards.length - 1 ? "text-[#4a4a7a] cursor-not-allowed" : "text-[#8888bb] cursor-pointer hover:text-[#e8e8ff]"
                  }`}
                >
                  Next →
                </button>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-3.5">
                {topic.flashcards.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setFcIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-200 ${
                      i === fcIndex ? "bg-[#4a4ae8]" : "bg-[rgba(74,74,232,0.2)]"
                    }`}
                  />
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
            <div className="mb-6">
              <div className="text-[11px] font-bold text-[#4a4a7a] uppercase tracking-wide mb-3.5">
                Multiple Choice · {mcqs.length} questions
              </div>
              {mcqs.map(q => <MCQQuestion key={q.id} q={q} />)}
            </div>
          )}
          {opens.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#4a4a7a] uppercase tracking-wide mb-3.5">
                Open Questions · {opens.length} questions
              </div>
              {opens.map(q => <OpenQuestion key={q.id} q={q} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Summary tab ── */}
      {tab === "summary" && (
        <div className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-6 max-w-[720px]">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[rgba(74,74,232,0.1)]">
            <span className="text-sm">📋</span>
            <span className="text-[13px] font-extrabold text-[#e8e8ff]">AI-Generated Summary</span>
            <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-[rgba(74,74,232,0.15)] text-[#6b6bf0] font-mono ml-1">✦ AI</span>
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
      className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-xl p-[18px_20px] cursor-pointer transition-all duration-200 relative overflow-hidden hover:border-[rgba(74,74,232,0.35)] hover:-translate-y-0.5"
    >
      {/* Glow */}
      <div className="absolute -top-[30px] -right-[30px] w-[90px] h-[90px] rounded-full opacity-[0.07] pointer-events-none" style={{ background: topic.color }} />

      <div className="flex items-start gap-3.5 mb-3.5">
        <div
          className="w-[42px] h-[42px] rounded-xl shrink-0 flex items-center justify-center text-xl"
          style={{ background: topic.color + "28", border: `1px solid ${topic.color}44` }}
        >
          {topic.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-[#e8e8ff] tracking-tight mb-1">{topic.title}</div>
          <div className="text-[10px] text-[#4a4a7a] font-mono">Generated {topic.createdAt}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2">
        {[
          { label: `${topic.flashcards.length} flashcards`, icon: "🃏" },
          { label: `${topic.questions.length} questions`, icon: "❓" },
          { label: "Summary", icon: "📋" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[10px] font-semibold bg-[rgba(74,74,232,0.1)] border border-[rgba(74,74,232,0.15)] text-[#8888bb]">
            <span className="text-[11px]">{s.icon}</span> {s.label}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="absolute bottom-4.5 right-5 text-[#4a4a7a] text-sm">→</div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-[60px] px-6 text-center">
      <div className="text-[52px] mb-4">📚</div>
      <div className="text-base font-extrabold text-[#e8e8ff] mb-2">No study notes yet</div>
      <div className="text-[13px] text-[#4a4a7a] leading-relaxed max-w-[340px] mb-6">
        Upload your lecture notes in the AI Assistant and it will automatically generate flashcards, questions, and a summary here.
      </div>
      <div className="flex items-center gap-2 py-2.5 px-4.5 rounded-lg bg-[rgba(74,74,232,0.12)] border border-[rgba(74,74,232,0.25)] text-[#a78bfa] text-xs font-bold">
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
    <div className="flex h-screen overflow-hidden font-['Outfit',sans-serif]">
      <Sidebar />
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out bg-[#050510]">
        <LIHeader pageName="Notes" pageDesc={`${topics.length} topics generated by AI`} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 text-[#e8e8ff] relative">
          {/* Background glow */}
          <div className="fixed top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(74,74,232,0.07)_0%,transparent_70%)] pointer-events-none z-0" />

          <div className="relative z-10">
            {selectedTopic ? (
              <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-[22px] font-extrabold tracking-tight">Study Notes</h1>
                    <p className="text-xs text-[#4a4a7a] mt-1 font-mono">
                      {topics.length} topics · generated by AI from your lecture notes
                    </p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a4a7a" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="bg-[#0a0a2e] border border-[rgba(74,74,232,0.15)] rounded-lg py-2.5 pl-9 pr-3.5 text-[#e8e8ff] text-xs w-[220px] transition-colors duration-200 focus:border-[rgba(74,74,232,0.45)] outline-none placeholder:text-[#4a4a7a]"
                    />
                  </div>
                </div>

                {/* Info banner */}
                <div className="flex items-center gap-2.5 py-2.5 px-4 rounded-lg bg-[rgba(74,74,232,0.07)] border border-[rgba(74,74,232,0.15)] mb-6 text-xs text-[#8888bb]">
                  <span className="text-[#6b6bf0] text-sm">✦</span>
                  Topics are automatically created when you scan lecture notes in the <strong className="text-[#a78bfa]">AI Assistant</strong>. Each topic includes flashcards, questions, and a summary.
                </div>

                {/* Grid or empty */}
                {filtered.length === 0 && search ? (
                  <div className="text-center py-12 text-[#4a4a7a] text-[13px]">
                    No topics matching "{search}"
                  </div>
                ) : topics.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
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
  );
}