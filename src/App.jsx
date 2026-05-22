import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Compass,
  Gauge,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPinned,
  Mountain,
  Route,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  XCircle,
} from "lucide-react";
import { allMonths, trekSeed } from "./data/fallbackTreks.js";
import { hasSupabaseConfig, supabase } from "./lib/supabase.js";

const difficultyModes = ["All", "Easy", "Moderate", "Difficult"];
const submissionDifficulties = difficultyModes.slice(1);
const indianRupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const emptySubmission = {
  name: "",
  region: "",
  country: "India",
  difficulty: "Moderate",
  duration_days: "5",
  max_altitude_m: "",
  distance_km: "",
  best_months: ["Oct", "Nov"],
  price_from_inr: "",
  risk_level: "",
  summary: "",
  image_url: "",
  highlights: "",
  essentials: "",
  waypoints: "",
};

function normalizeTrek(trek) {
  return {
    ...trek,
    best_months: trek.best_months ?? [],
    highlights: trek.highlights ?? [],
    essentials: trek.essentials ?? [],
    waypoints: trek.waypoints ?? [],
    signal: trek.signal ?? 80,
  };
}

function splitList(value) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) {
    return "Waiting";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusTone(status) {
  if (status === "approved") {
    return "approved";
  }

  if (status === "rejected") {
    return "rejected";
  }

  return "pending";
}

function SurfaceBar({ activePanel, isAdmin, profile, session, onSelectPanel }) {
  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  return (
    <header className={`surface-bar${activePanel === "travel" ? " is-hero" : ""}`}>
      <button className="surface-brand" onClick={() => onSelectPanel("travel")} type="button">
        <Compass aria-hidden="true" />
        TrekDesk
      </button>
      <nav aria-label="Site panels" className="panel-switch">
        <button
          aria-pressed={activePanel === "travel"}
          onClick={() => onSelectPanel("travel")}
          type="button"
        >
          <Route aria-hidden="true" />
          Travel
        </button>
        <button
          aria-pressed={activePanel === "trekker"}
          onClick={() => onSelectPanel("trekker")}
          type="button"
        >
          <ClipboardPlus aria-hidden="true" />
          Trekker
        </button>
        <button
          aria-pressed={activePanel === "admin"}
          onClick={() => onSelectPanel("admin")}
          type="button"
        >
          <LayoutDashboard aria-hidden="true" />
          Admin
        </button>
      </nav>
      <div className="account-actions">
        {session ? (
          <>
            <span title={session.user.email}>
              <UserRound aria-hidden="true" />
              {profile?.display_name || session.user.email}
              {isAdmin ? " - Admin" : ""}
            </span>
            <button className="icon-only" onClick={signOut} title="Sign out" type="button">
              <LogOut aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </button>
          </>
        ) : (
          <button onClick={() => onSelectPanel("trekker")} type="button">
            <LogIn aria-hidden="true" />
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

function AuthCard({ title }) {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submitAuth(event) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setBusy(true);
    setMessage("");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName.trim() } },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      mode === "signup" && !result.data.session
        ? "Check your email to confirm the new trekker account."
        : "Account connected.",
    );
  }

  if (!hasSupabaseConfig) {
    return (
      <section className="auth-card setup-card">
        <ShieldAlert aria-hidden="true" />
        <div>
          <p>Supabase setup required</p>
          <h2>{title}</h2>
          <span>
            Add the project URL and publishable key to enable account sign-in, trekker
            submissions, and the admin review queue.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <div className="auth-title">
        <LogIn aria-hidden="true" />
        <div>
          <p>Account access</p>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="auth-modes" role="group" aria-label="Authentication mode">
        <button
          aria-pressed={mode === "signin"}
          onClick={() => setMode("signin")}
          type="button"
        >
          Sign in
        </button>
        <button
          aria-pressed={mode === "signup"}
          onClick={() => setMode("signup")}
          type="button"
        >
          Create trekker
        </button>
      </div>
      <form onSubmit={submitAuth}>
        {mode === "signup" ? (
          <label>
            <span>Name</span>
            <input
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
              required
              value={fullName}
            />
          </label>
        ) : null}
        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength="6"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <button disabled={busy} type="submit">
          {busy ? "Connecting..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
      {message ? <p className="form-message">{message}</p> : null}
    </section>
  );
}

function TrekCard({ active, saved, trek, onOpen, onToggleSave }) {
  return (
    <article className={`trek-card${active ? " is-active" : ""}`}>
      <button className="trek-image-button" onClick={() => onOpen(trek)} type="button">
        <img alt={trek.image_alt} src={trek.image_url} />
      </button>
      <div className="trek-card-body">
        <div className="trek-card-topline">
          <span>{trek.region}</span>
          <strong>{trek.difficulty}</strong>
        </div>
        <div className="trek-heading-row">
          <button onClick={() => onOpen(trek)} type="button">
            {trek.name}
          </button>
          <button
            aria-label={`${saved ? "Remove" : "Save"} ${trek.name}`}
            className={`save-button${saved ? " is-saved" : ""}`}
            onClick={() => onToggleSave(trek.slug)}
            title={saved ? "Remove from shortlist" : "Add to shortlist"}
            type="button"
          >
            <Heart aria-hidden="true" />
          </button>
        </div>
        <p>{trek.summary}</p>
        <dl className="trek-metrics">
          <div>
            <dt>
              <CalendarDays aria-hidden="true" />
              Days
            </dt>
            <dd>{trek.duration_days}</dd>
          </div>
          <div>
            <dt>
              <Mountain aria-hidden="true" />
              Peak
            </dt>
            <dd>{trek.max_altitude_m.toLocaleString("en-IN")} m</dd>
          </div>
          <div>
            <dt>
              <Wallet aria-hidden="true" />
              From
            </dt>
            <dd>{indianRupees.format(trek.price_from_inr)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function DetailPanel({ saved, trek, onToggleSave }) {
  if (!trek) {
    return null;
  }

  return (
    <aside className="detail-panel" aria-live="polite">
      <div className="detail-media">
        <img alt={trek.image_alt} src={trek.image_url} />
      </div>
      <div className="detail-body">
        <div className="detail-title-row">
          <div>
            <p>{trek.country}</p>
            <h2>{trek.name}</h2>
          </div>
          <button
            className={`icon-command${saved ? " is-saved" : ""}`}
            onClick={() => onToggleSave(trek.slug)}
            title={saved ? "Remove from shortlist" : "Add to shortlist"}
            type="button"
          >
            <Heart aria-hidden="true" />
            <span className="sr-only">{saved ? "Remove from shortlist" : "Add to shortlist"}</span>
          </button>
        </div>
        <p className="detail-summary">{trek.summary}</p>
        <div className="signal-grid">
          <div>
            <span>Trail signal</span>
            <strong>{trek.signal}/100</strong>
          </div>
          <div>
            <span>Distance</span>
            <strong>{trek.distance_km} km</strong>
          </div>
          <div>
            <span>Risk focus</span>
            <strong>{trek.risk_level}</strong>
          </div>
        </div>
        <section className="detail-section">
          <h3>Season window</h3>
          <div className="month-row">
            {trek.best_months.map((entry) => (
              <span key={entry}>{entry}</span>
            ))}
          </div>
        </section>
        <section className="detail-section">
          <h3>Route ledger</h3>
          <ol className="route-ledger">
            {trek.waypoints.map((waypoint) => (
              <li key={waypoint}>{waypoint}</li>
            ))}
          </ol>
        </section>
        <section className="detail-section detail-columns">
          <div>
            <h3>Highlights</h3>
            <ul>
              {trek.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Essentials</h3>
            <ul>
              {trek.essentials.map((essential) => (
                <li key={essential}>{essential}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </aside>
  );
}

function TravelPanel({
  averageAltitude,
  difficulty,
  fastestTrek,
  filteredTreks,
  maxDays,
  month,
  region,
  regions,
  savedSlugs,
  savedTreks,
  searchTerm,
  selectedTrek,
  sourceState,
  treks,
  onDifficultyChange,
  onMaxDaysChange,
  onMonthChange,
  onRegionChange,
  onSearchChange,
  onSelectSlug,
  onToggleSave,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p>
            <ShieldCheck aria-hidden="true" />
            Trek intelligence for confident plans
          </p>
          <h1>TrekDesk</h1>
          <span>
            Compare altitude, season windows, terrain focus, and route checkpoints before a
            mountain itinerary makes it onto your calendar.
          </span>
          <a className="hero-command" href="#trek-desk">
            Open travel desk
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="hero-strip" role="list" aria-label="Catalog summary">
          <div role="listitem">
            <strong>{treks.length}</strong>
            <span>Tracked routes</span>
          </div>
          <div role="listitem">
            <strong>
              {Math.max(...treks.map((trek) => trek.max_altitude_m)).toLocaleString("en-IN")} m
            </strong>
            <span>Highest catalog peak</span>
          </div>
          <div role="listitem">
            <strong>{savedTreks.length}</strong>
            <span>Shortlisted now</span>
          </div>
          <div role="listitem">
            <strong>{sourceState}</strong>
            <span>Data source</span>
          </div>
        </div>
      </section>

      <section className="desk" id="trek-desk">
        <div className="desk-header">
          <div>
            <p>
              <Sparkles aria-hidden="true" />
              Trek screener
            </p>
            <h2>Choose with route-level clarity</h2>
          </div>
          <div className="desk-kpis" aria-label="Filtered trek metrics">
            <div>
              <span>Matches</span>
              <strong>{filteredTreks.length}</strong>
            </div>
            <div>
              <span>Average peak</span>
              <strong>
                {averageAltitude ? `${averageAltitude.toLocaleString("en-IN")} m` : "None"}
              </strong>
            </div>
            <div>
              <span>Shortest</span>
              <strong>{fastestTrek ? `${fastestTrek.duration_days} days` : "None"}</strong>
            </div>
          </div>
        </div>

        <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
          <label className="search-field">
            <span className="sr-only">Search treks</span>
            <Search aria-hidden="true" />
            <input
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search a trek, region, or highlight"
              type="search"
              value={searchTerm}
            />
          </label>
          <label>
            <span>Region</span>
            <select onChange={(event) => onRegionChange(event.target.value)} value={region}>
              {regions.map((entry) => (
                <option key={entry}>{entry}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Season</span>
            <select onChange={(event) => onMonthChange(event.target.value)} value={month}>
              <option>All seasons</option>
              {allMonths.map((entry) => (
                <option key={entry}>{entry}</option>
              ))}
            </select>
          </label>
          <label className="days-field">
            <span>Max length</span>
            <input
              max="12"
              min="4"
              onChange={(event) => onMaxDaysChange(Number(event.target.value))}
              type="range"
              value={maxDays}
            />
            <strong>{maxDays} days</strong>
          </label>
          <fieldset>
            <legend>Difficulty</legend>
            <div className="segmented-control">
              {difficultyModes.map((entry) => (
                <button
                  aria-pressed={difficulty === entry}
                  key={entry}
                  onClick={() => onDifficultyChange(entry)}
                  type="button"
                >
                  {entry}
                </button>
              ))}
            </div>
          </fieldset>
        </form>

        {savedTreks.length ? (
          <div className="shortlist" aria-label="Shortlisted treks">
            <MapPinned aria-hidden="true" />
            {savedTreks.map((trek) => (
              <button key={trek.slug} onClick={() => onSelectSlug(trek.slug)} type="button">
                {trek.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="catalog-layout">
          <div className="trek-grid">
            {filteredTreks.length ? (
              filteredTreks.map((trek) => (
                <TrekCard
                  active={selectedTrek?.slug === trek.slug}
                  key={trek.slug}
                  onOpen={(entry) => onSelectSlug(entry.slug)}
                  onToggleSave={onToggleSave}
                  saved={savedSlugs.has(trek.slug)}
                  trek={trek}
                />
              ))
            ) : (
              <div className="empty-state">
                <Gauge aria-hidden="true" />
                <h3>No routes match this screen</h3>
                <p>Widen the season, duration, or difficulty filter to bring treks back in.</p>
              </div>
            )}
          </div>
          <DetailPanel
            onToggleSave={onToggleSave}
            saved={savedSlugs.has(selectedTrek?.slug)}
            trek={selectedTrek}
          />
        </div>
      </section>
    </>
  );
}

function SubmissionQueue({ submissions }) {
  return (
    <section className="submission-queue">
      <div className="workspace-heading">
        <div>
          <p>My submissions</p>
          <h2>Review trail</h2>
        </div>
        <strong>{submissions.length}</strong>
      </div>
      {submissions.length ? (
        <div className="queue-list">
          {submissions.map((submission) => (
            <article key={submission.id}>
              <div>
                <span className={`status-pill ${statusTone(submission.status)}`}>
                  {submission.status}
                </span>
                <h3>{submission.name}</h3>
                <p>
                  {submission.region}, {submission.country} - {submission.duration_days} days -{" "}
                  {indianRupees.format(submission.price_from_inr)}
                </p>
              </div>
              <dl>
                <div>
                  <dt>Sent</dt>
                  <dd>{formatDate(submission.created_at)}</dd>
                </div>
                <div>
                  <dt>Review</dt>
                  <dd>{formatDate(submission.reviewed_at)}</dd>
                </div>
              </dl>
              {submission.admin_notes ? <em>{submission.admin_notes}</em> : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="quiet-state">Your first trek submission will appear here.</p>
      )}
    </section>
  );
}

function TrekkerPanel({ session }) {
  const [form, setForm] = useState(emptySubmission);
  const [submissions, setSubmissions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;

    async function loadOwnSubmissions() {
      if (!supabase || !session) {
        return;
      }

      const { data, error } = await supabase
        .from("trek_submissions")
        .select(
          "id,name,region,country,duration_days,price_from_inr,status,admin_notes,created_at,reviewed_at",
        )
        .order("created_at", { ascending: false });

      if (!current) {
        return;
      }

      if (error) {
        setMessage(error.message);
        return;
      }

      setSubmissions(data ?? []);
    }

    loadOwnSubmissions();

    return () => {
      current = false;
    };
  }, [session]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleMonth(entry) {
    setForm((current) => ({
      ...current,
      best_months: current.best_months.includes(entry)
        ? current.best_months.filter((month) => month !== entry)
        : [...current.best_months, entry],
    }));
  }

  async function submitTrek(event) {
    event.preventDefault();

    if (!supabase || !session) {
      return;
    }

    setBusy(true);
    setMessage("");

    const submission = {
      submitted_by: session.user.id,
      name: form.name.trim(),
      region: form.region.trim(),
      country: form.country.trim(),
      difficulty: form.difficulty,
      duration_days: Number(form.duration_days),
      max_altitude_m: Number(form.max_altitude_m),
      distance_km: Number(form.distance_km),
      best_months: form.best_months,
      price_from_inr: Number(form.price_from_inr),
      risk_level: form.risk_level.trim(),
      summary: form.summary.trim(),
      image_url: form.image_url.trim() || trekSeed[0].image_url,
      image_alt: `${form.name.trim()} trek image`,
      highlights: splitList(form.highlights),
      essentials: splitList(form.essentials),
      waypoints: splitList(form.waypoints),
    };

    const { data, error } = await supabase
      .from("trek_submissions")
      .insert(submission)
      .select(
        "id,name,region,country,duration_days,price_from_inr,status,admin_notes,created_at,reviewed_at",
      )
      .single();

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSubmissions((current) => [data, ...current]);
    setForm(emptySubmission);
    setMessage("Trek submitted for admin review.");
  }

  if (!session) {
    return (
      <WorkspaceShell
        eyebrow="Trekker panel"
        title="Submit trek cost and route intelligence"
        summary="Trekkers add costs, season windows, route facts, and preparation notes for admin review."
      >
        <AuthCard title="Trekker workspace" />
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      eyebrow="Trekker panel"
      title="Submit trek cost and route intelligence"
      summary="Each submission stays in a review queue until an admin publishes it to the travel panel."
    >
      <div className="trekker-layout">
        <section className="submission-form">
          <div className="workspace-heading">
            <div>
              <p>New submission</p>
              <h2>Trek ledger</h2>
            </div>
            <ClipboardPlus aria-hidden="true" />
          </div>
          <form onSubmit={submitTrek}>
            <div className="form-grid">
              <label>
                <span>Trek name</span>
                <input
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  value={form.name}
                />
              </label>
              <label>
                <span>Region</span>
                <input
                  onChange={(event) => updateField("region", event.target.value)}
                  required
                  value={form.region}
                />
              </label>
              <label>
                <span>Country</span>
                <input
                  onChange={(event) => updateField("country", event.target.value)}
                  required
                  value={form.country}
                />
              </label>
              <label>
                <span>Difficulty</span>
                <select
                  onChange={(event) => updateField("difficulty", event.target.value)}
                  value={form.difficulty}
                >
                  {submissionDifficulties.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Days</span>
                <input
                  min="1"
                  onChange={(event) => updateField("duration_days", event.target.value)}
                  required
                  type="number"
                  value={form.duration_days}
                />
              </label>
              <label>
                <span>Distance km</span>
                <input
                  min="1"
                  onChange={(event) => updateField("distance_km", event.target.value)}
                  required
                  type="number"
                  value={form.distance_km}
                />
              </label>
              <label>
                <span>Max altitude m</span>
                <input
                  min="1"
                  onChange={(event) => updateField("max_altitude_m", event.target.value)}
                  required
                  type="number"
                  value={form.max_altitude_m}
                />
              </label>
              <label>
                <span>Cost from INR</span>
                <input
                  min="0"
                  onChange={(event) => updateField("price_from_inr", event.target.value)}
                  required
                  type="number"
                  value={form.price_from_inr}
                />
              </label>
            </div>
            <fieldset className="month-picker">
              <legend>Best months</legend>
              {allMonths.map((entry) => (
                <label key={entry}>
                  <input
                    checked={form.best_months.includes(entry)}
                    onChange={() => toggleMonth(entry)}
                    type="checkbox"
                  />
                  <span>{entry}</span>
                </label>
              ))}
            </fieldset>
            <div className="form-stack">
              <label>
                <span>Risk focus</span>
                <input
                  onChange={(event) => updateField("risk_level", event.target.value)}
                  placeholder="Altitude, weather, river crossings"
                  required
                  value={form.risk_level}
                />
              </label>
              <label>
                <span>Summary</span>
                <textarea
                  onChange={(event) => updateField("summary", event.target.value)}
                  required
                  rows="3"
                  value={form.summary}
                />
              </label>
              <label>
                <span>Photo URL</span>
                <input
                  onChange={(event) => updateField("image_url", event.target.value)}
                  placeholder="Optional route photo URL"
                  type="url"
                  value={form.image_url}
                />
              </label>
              <div className="textarea-grid">
                <label>
                  <span>Highlights</span>
                  <textarea
                    onChange={(event) => updateField("highlights", event.target.value)}
                    placeholder="Pass crossing, alpine lake"
                    required
                    rows="3"
                    value={form.highlights}
                  />
                </label>
                <label>
                  <span>Essentials</span>
                  <textarea
                    onChange={(event) => updateField("essentials", event.target.value)}
                    placeholder="Poles, rain shell"
                    required
                    rows="3"
                    value={form.essentials}
                  />
                </label>
                <label>
                  <span>Waypoints</span>
                  <textarea
                    onChange={(event) => updateField("waypoints", event.target.value)}
                    placeholder="Base village, camp, pass"
                    required
                    rows="3"
                    value={form.waypoints}
                  />
                </label>
              </div>
            </div>
            <button disabled={busy || !form.best_months.length} type="submit">
              {busy ? "Submitting..." : "Send for review"}
            </button>
            {message ? <p className="form-message">{message}</p> : null}
          </form>
        </section>
        <SubmissionQueue submissions={submissions} />
      </div>
    </WorkspaceShell>
  );
}

function WorkspaceShell({ children, eyebrow, summary, title }) {
  return (
    <section className="workspace-panel">
      <header>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{summary}</span>
      </header>
      {children}
    </section>
  );
}

function AdminReviewBoard({ session }) {
  const [submissions, setSubmissions] = useState([]);
  const [notes, setNotes] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  async function loadReviewQueue() {
    const { data, error } = await supabase
      .from("trek_submissions")
      .select(
        "id,name,region,country,difficulty,duration_days,max_altitude_m,distance_km,price_from_inr,status,summary,admin_notes,created_at,reviewed_at,submitted_by",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSubmissions(data ?? []);
    setNotes(
      Object.fromEntries((data ?? []).map((entry) => [entry.id, entry.admin_notes ?? ""])),
    );
  }

  useEffect(() => {
    loadReviewQueue();
  }, []);

  async function publishSubmission(submissionId) {
    setBusyId(submissionId);
    setMessage("");

    const { error } = await supabase.rpc("publish_submission", {
      target_submission_id: submissionId,
    });

    setBusyId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Submission approved and published to the travel panel.");
    await loadReviewQueue();
  }

  async function rejectSubmission(submissionId) {
    setBusyId(submissionId);
    setMessage("");

    const { error } = await supabase
      .from("trek_submissions")
      .update({
        admin_notes: notes[submissionId] || "Needs revision before publishing.",
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id,
        status: "rejected",
      })
      .eq("id", submissionId);

    setBusyId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Submission returned to the trekker queue.");
    await loadReviewQueue();
  }

  const pendingCount = submissions.filter((entry) => entry.status === "pending").length;
  const approvedCount = submissions.filter((entry) => entry.status === "approved").length;

  return (
    <div className="admin-board">
      <div className="admin-metrics" aria-label="Admin queue metrics">
        <div>
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{approvedCount}</strong>
        </div>
        <div>
          <span>Total submissions</span>
          <strong>{submissions.length}</strong>
        </div>
      </div>
      {message ? <p className="board-message">{message}</p> : null}
      <section className="review-list">
        {submissions.length ? (
          submissions.map((submission) => (
            <article key={submission.id}>
              <div className="review-title">
                <div>
                  <span className={`status-pill ${statusTone(submission.status)}`}>
                    {submission.status}
                  </span>
                  <h2>{submission.name}</h2>
                  <p>
                    {submission.region}, {submission.country} - {submission.difficulty} -{" "}
                    {indianRupees.format(submission.price_from_inr)}
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>Days</dt>
                    <dd>{submission.duration_days}</dd>
                  </div>
                  <div>
                    <dt>Peak</dt>
                    <dd>{submission.max_altitude_m.toLocaleString("en-IN")} m</dd>
                  </div>
                  <div>
                    <dt>Sent</dt>
                    <dd>{formatDate(submission.created_at)}</dd>
                  </div>
                </dl>
              </div>
              <p className="review-summary">{submission.summary}</p>
              <label>
                <span>Admin note</span>
                <textarea
                  onChange={(event) =>
                    setNotes((current) => ({
                      ...current,
                      [submission.id]: event.target.value,
                    }))
                  }
                  rows="2"
                  value={notes[submission.id] ?? ""}
                />
              </label>
              <div className="review-actions">
                <button
                  disabled={busyId === submission.id || submission.status === "approved"}
                  onClick={() => publishSubmission(submission.id)}
                  type="button"
                >
                  <CheckCircle2 aria-hidden="true" />
                  Approve and publish
                </button>
                <button
                  disabled={busyId === submission.id || submission.status === "rejected"}
                  onClick={() => rejectSubmission(submission.id)}
                  type="button"
                >
                  <XCircle aria-hidden="true" />
                  Reject
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="quiet-state">No trek submissions have arrived yet.</p>
        )}
      </section>
    </div>
  );
}

function AdminPanel({ isAdmin, profile, session }) {
  if (!session) {
    return (
      <WorkspaceShell
        eyebrow="Admin panel"
        title="Review and publish route submissions"
        summary="Only admin accounts can approve routes into the public travel desk."
      >
        <AuthCard title="Admin access" />
      </WorkspaceShell>
    );
  }

  if (!isAdmin) {
    return (
      <WorkspaceShell
        eyebrow="Admin panel"
        title="Review and publish route submissions"
        summary="Only admin accounts can approve routes into the public travel desk."
      >
        <section className="access-card">
          <ShieldAlert aria-hidden="true" />
          <div>
            <p>Access restricted</p>
            <h2>{profile?.display_name || session.user.email}</h2>
            <span>This signed-in account has trekker access, not admin access.</span>
          </div>
        </section>
      </WorkspaceShell>
    );
  }

  return (
    <WorkspaceShell
      eyebrow="Admin panel"
      title="Review and publish route submissions"
      summary="Approve clean route data into the live travel panel or return submissions with notes."
    >
      <AdminReviewBoard session={session} />
    </WorkspaceShell>
  );
}

function App() {
  const [activePanel, setActivePanel] = useState("travel");
  const [treks, setTreks] = useState(trekSeed);
  const [selectedSlug, setSelectedSlug] = useState(trekSeed[0].slug);
  const [savedSlugs, setSavedSlugs] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [region, setRegion] = useState("All regions");
  const [month, setMonth] = useState("All seasons");
  const [maxDays, setMaxDays] = useState(12);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sourceState, setSourceState] = useState(
    hasSupabaseConfig ? "Syncing live trek desk" : "Preview trek desk",
  );

  useEffect(() => {
    let current = true;

    async function loadTreks() {
      if (!supabase) {
        return;
      }

      const { data, error } = await supabase
        .from("treks")
        .select(
          "slug,name,region,country,difficulty,duration_days,max_altitude_m,distance_km,best_months,price_from_inr,risk_level,summary,image_url,image_alt,highlights,essentials,waypoints,signal,featured_rank",
        )
        .eq("published", true)
        .order("featured_rank", { ascending: true });

      if (!current) {
        return;
      }

      if (error || !data?.length) {
        setSourceState("Seed trek desk");
        return;
      }

      const liveTreks = data.map(normalizeTrek);
      setTreks(liveTreks);
      setSelectedSlug((value) =>
        liveTreks.some((trek) => trek.slug === value) ? value : liveTreks[0].slug,
      );
      setSourceState("Supabase live");
    }

    loadTreks();

    return () => {
      current = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let current = true;

    async function loadProfile() {
      if (!supabase || !session) {
        setProfile(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id,display_name,role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (current) {
        setProfile(data ?? { id: session.user.id, role: "trekker" });
      }
    }

    loadProfile();

    return () => {
      current = false;
    };
  }, [session]);

  const regions = useMemo(
    () => ["All regions", ...new Set(treks.map((trek) => trek.region))],
    [treks],
  );

  const filteredTreks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return treks.filter((trek) => {
      const searchMatch =
        !query ||
        [trek.name, trek.region, trek.country, trek.summary, ...trek.highlights]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const difficultyMatch = difficulty === "All" || trek.difficulty === difficulty;
      const regionMatch = region === "All regions" || trek.region === region;
      const monthMatch = month === "All seasons" || trek.best_months.includes(month);
      const daysMatch = trek.duration_days <= maxDays;

      return searchMatch && difficultyMatch && regionMatch && monthMatch && daysMatch;
    });
  }, [difficulty, maxDays, month, region, searchTerm, treks]);

  const selectedTrek =
    filteredTreks.find((trek) => trek.slug === selectedSlug) ??
    filteredTreks[0] ??
    treks.find((trek) => trek.slug === selectedSlug) ??
    treks[0];
  const savedTreks = treks.filter((trek) => savedSlugs.has(trek.slug));
  const fastestTrek = filteredTreks.reduce(
    (candidate, trek) =>
      !candidate || trek.duration_days < candidate.duration_days ? trek : candidate,
    null,
  );
  const averageAltitude = filteredTreks.length
    ? Math.round(
        filteredTreks.reduce((total, trek) => total + trek.max_altitude_m, 0) /
          filteredTreks.length,
      )
    : 0;
  const isAdmin = profile?.role === "admin";

  function toggleSave(slug) {
    setSavedSlugs((value) => {
      const next = new Set(value);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  return (
    <main>
      <SurfaceBar
        activePanel={activePanel}
        isAdmin={isAdmin}
        onSelectPanel={setActivePanel}
        profile={profile}
        session={session}
      />
      {activePanel === "travel" ? (
        <TravelPanel
          averageAltitude={averageAltitude}
          difficulty={difficulty}
          fastestTrek={fastestTrek}
          filteredTreks={filteredTreks}
          maxDays={maxDays}
          month={month}
          onDifficultyChange={setDifficulty}
          onMaxDaysChange={setMaxDays}
          onMonthChange={setMonth}
          onRegionChange={setRegion}
          onSearchChange={setSearchTerm}
          onSelectSlug={setSelectedSlug}
          onToggleSave={toggleSave}
          region={region}
          regions={regions}
          savedSlugs={savedSlugs}
          savedTreks={savedTreks}
          searchTerm={searchTerm}
          selectedTrek={selectedTrek}
          sourceState={sourceState}
          treks={treks}
        />
      ) : null}
      {activePanel === "trekker" ? <TrekkerPanel session={session} /> : null}
      {activePanel === "admin" ? (
        <AdminPanel isAdmin={isAdmin} profile={profile} session={session} />
      ) : null}
    </main>
  );
}

export default App;
