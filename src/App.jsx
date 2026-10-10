import { useEffect, useMemo, useState } from "react";

const KEY = "preptrack-questions";
const starter = [
  {
    id: 1,
    title: "Two Sum",
    category: "DSA",
    difficulty: "Easy",
    status: "Completed",
    notes: "Hash map approach",
  },
  {
    id: 2,
    title: "Explain Git rebase",
    category: "Git",
    difficulty: "Medium",
    status: "In Progress",
    notes: "Practice with examples",
  },
  {
    id: 3,
    title: "Design a rate limiter",
    category: "Technical",
    difficulty: "Hard",
    status: "Pending",
    notes: "",
  },
  {
    id: 4,
    title: "Merge Intervals",
    category: "DSA",
    difficulty: "Medium",
    status: "Completed",
    notes: "Sort then merge",
  },
];
const categories = ["DSA", "Git", "Technical"],
  difficulties = ["Easy", "Medium", "Hard"],
  statuses = ["Pending", "In Progress", "Completed"];
const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || starter;
  } catch {
    return starter;
  }
};

function Stat({ symbol, value, label, tone }) {
  return (
    <article className={`stat ${tone}`}>
      <b>{symbol}</b>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [questions, setQuestions] = useState(load),
    [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    difficulty: "All",
    status: "All",
  });
  const [form, setForm] = useState({
      title: "",
      category: "DSA",
      difficulty: "Easy",
      status: "Pending",
      notes: "",
    }),
    [error, setError] = useState("");
  useEffect(
    () => localStorage.setItem(KEY, JSON.stringify(questions)),
    [questions],
  );
  const completed = questions.filter((q) => q.status === "Completed").length,
    progress = questions.length
      ? Math.round((completed / questions.length) * 100)
      : 0;
  const visible = useMemo(
    () =>
      questions.filter(
        (q) =>
          `${q.title} ${q.category} ${q.notes}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          Object.entries(filters).every(
            ([key, val]) => val === "All" || q[key] === val,
          ),
      ),
    [questions, search, filters],
  );
  const update = (id, status) =>
    setQuestions((items) =>
      items.map((q) => (q.id === id ? { ...q, status } : q)),
    );
  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim())
      return setError("Give this question a clear title before saving.");
    setQuestions((items) => [
      { ...form, title: form.title.trim(), id: crypto.randomUUID() },
      ...items,
    ]);
    setForm({
      title: "",
      category: "DSA",
      difficulty: "Easy",
      status: "Pending",
      notes: "",
    });
    setError("");
    setOpen(false);
  };
  const clear = () => {
    setSearch("");
    setFilters({ category: "All", difficulty: "All", status: "All" });
  };
  const machine = questions.some(
    (q) => q.category === "Technical" && q.status === "Completed",
  )
    ? "Done"
    : "Not started";
  return (
    <main>
      <nav>
        <a className="brand" href="#top">
          <i>⌁</i> Prep<span>Track</span>
        </a>
        <p>
          <em /> Your interview workspace
        </p>
        <button className="primary" onClick={() => setOpen(true)}>
          ＋ Add question
        </button>
      </nav>
      <section className="hero" id="top">
        <div>
          <small>WEEKLY PRACTICE DASHBOARD</small>
          <h1>
            Keep momentum.
            <br />
            <em>Land the role.</em>
          </h1>
          <p>
            A focused view of every problem, question, and skill you are
            building for your next interview.
          </p>
        </div>
        <div className="progress">
          <div className="ring" style={{ "--p": `${progress * 3.6}deg` }}>
            <div>
              <strong>{progress}%</strong>
              <span>complete</span>
            </div>
          </div>
          <div>
            <small>YOUR PROGRESS</small>
            <h2>
              {completed} of {questions.length} done
            </h2>
            <p>Every completed problem compounds.</p>
          </div>
        </div>
      </section>
      <section className="stats">
        <Stat
          symbol="◫"
          value={questions.length}
          label="Total questions"
          tone="purple"
        />
        <Stat
          symbol="⌘"
          value={
            questions.filter(
              (q) => q.category === "DSA" && q.status === "Completed",
            ).length
          }
          label="DSA completed"
          tone="green"
        />
        <Stat
          symbol="◉"
          value={
            questions.filter(
              (q) => q.category === "Technical" && q.status === "Completed",
            ).length
          }
          label="Technical completed"
          tone="orange"
        />
        <Stat symbol="↗" value={machine} label="Machine coding" tone="blue" />
      </section>
      <section className="tracker">
        <header>
          <div>
            <small>QUESTION TRACKER</small>
            <h2>Your practice queue</h2>
          </div>
          <span>{visible.length} shown</span>
        </header>
        <div className="controls">
          <label>
            ⌕
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, topics, notes..."
            />
          </label>
          {[
            ["category", categories],
            ["difficulty", difficulties],
            ["status", statuses],
          ].map(([field, options]) => (
            <select
              key={field}
              value={filters[field]}
              onChange={(e) =>
                setFilters((f) => ({ ...f, [field]: e.target.value }))
              }
            >
              <option value="All">All {field}s</option>
              {options.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          ))}
        </div>
        {!questions.length ? (
          <Empty
            icon="✦"
            title="Your queue is waiting"
            text="Add your first interview question and make today count."
            action={() => setOpen(true)}
            actionText="Add first question"
          />
        ) : !visible.length ? (
          <Empty
            icon="⌕"
            title="Nothing matched"
            text="Try changing your search or clearing one of the filters."
            action={clear}
            actionText="Clear filters"
            plain
          />
        ) : (
          <div className="list">
            {visible.map((q) => (
              <article className="row" key={q.id}>
                <div className="info">
                  <div>
                    <h3>{q.title}</h3>
                    <b className={`tag ${q.category.toLowerCase()}`}>
                      {q.category}
                    </b>
                  </div>
                  {q.notes && <p>{q.notes}</p>}
                </div>
                <b className={`difficulty ${q.difficulty.toLowerCase()}`}>
                  {q.difficulty}
                </b>
                <select
                  className={`status ${q.status.toLowerCase().replace(" ", "-")}`}
                  value={q.status}
                  onChange={(e) => update(q.id, e.target.value)}
                >
                  {statuses.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <button
                  className="delete"
                  onClick={() =>
                    setQuestions((items) => items.filter((x) => x.id !== q.id))
                  }
                  aria-label={`Delete ${q.title}`}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      {open && (
        <div className="backdrop" onMouseDown={() => setOpen(false)}>
          <form onSubmit={save} onMouseDown={(e) => e.stopPropagation()}>
            <header>
              <div>
                <small>NEW PRACTICE ITEM</small>
                <h2>Add a question</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                ×
              </button>
            </header>
            <label>
              Question title
              <input
                autoFocus
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  setError("");
                }}
                placeholder="e.g. Explain event delegation"
              />
            </label>
            {error && <p className="error">{error}</p>}
            <div className="fields">
              {[
                ["category", categories],
                ["difficulty", difficulties],
                ["status", statuses],
              ].map(([field, options]) => (
                <label key={field}>
                  {field}
                  <select
                    value={form[field]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field]: e.target.value }))
                    }
                  >
                    {options.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label>
              Notes <i>(optional)</i>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="What should you remember?"
                rows="3"
              />
            </label>
            <footer>
              <button
                type="button"
                className="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="primary">Save question</button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
function Empty({ icon, title, text, action, actionText, plain }) {
  return (
    <div className="empty">
      <b>{icon}</b>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className={plain ? "link" : "primary"} onClick={action}>
        {actionText}
      </button>
    </div>
  );
}
