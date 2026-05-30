import { useState, useEffect, useRef } from "react";

const BUDGET_OPTIONS = [
  { label: "Cheap Date", value: "budget", icon: "🪙", desc: "Under $30" },
  { label: "Mid-Range", value: "moderate", icon: "💵", desc: "$30–$80" },
  { label: "Splash Out", value: "upscale", icon: "💎", desc: "$80–$200+" },
];

const RADIUS_OPTIONS = [
  { label: "5 mi", value: 5 },
  { label: "10 mi", value: 10 },
  { label: "25 mi", value: 25 },
  { label: "50 mi", value: 50 },
];

const VIBE_OPTIONS = [
  { value: "classic", label: "Classic Date Night", icon: "🥂", desc: "Dinner + fun activity" },
  { value: "adventure", label: "Wild Adventure", icon: "🏔️", desc: "Outdoors + thrills" },
];

function activityEmoji(type = "") {
  const t = type.toLowerCase();
  if (t.includes("movie")) return "🎬";
  if (t.includes("concert") || t.includes("music")) return "🎵";
  if (t.includes("axe")) return "🪓";
  if (t.includes("escape")) return "🔐";
  if (t.includes("bowl")) return "🎳";
  if (t.includes("museum") || t.includes("art")) return "🏛️";
  if (t.includes("hike") || t.includes("trail")) return "🥾";
  if (t.includes("raft") || t.includes("kayak") || t.includes("canoe")) return "🚣";
  if (t.includes("park") || t.includes("nature")) return "🌿";
  if (t.includes("climb")) return "🧗";
  if (t.includes("bike") || t.includes("cycle")) return "🚵";
  if (t.includes("zip")) return "🪂";
  if (t.includes("bar") || t.includes("cocktail") || t.includes("wine")) return "🍸";
  return "✨";
}

function HeartLoader({ vibe }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div className="heart-pulse">{vibe === "adventure" ? "🏔️" : "❤️"}</div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#c0392b", opacity: 0.8 }}>
        {vibe === "adventure" ? "Finding your wild date..." : "Planning your perfect date..."}
      </p>
    </div>
  );
}

function ResultCard({ emoji, title, subtitle, details, type, bookingUrl, bookingLabel, delay = 0 }) {
  return (
    <div className="result-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="result-type-label">{type}</div>
      <div className="result-emoji">{emoji}</div>
      <h3 className="result-title">{title}</h3>
      {subtitle && <p className="result-subtitle">{subtitle}</p>}
      {details && details.length > 0 && (
        <ul className="result-details">
          {details.map((d, i) => d && <li key={i}>{d}</li>)}
        </ul>
      )}
      {bookingUrl && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="booking-link"
        >
          🔗 {bookingLabel || "Book / View"}
        </a>
      )}
    </div>
  );
}

function SavedDatesPanel({ saved, onLoad, onDelete, onClose }) {
  if (saved.length === 0) {
    return (
      <div className="saved-panel">
        <div className="saved-header">
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Saved Dates</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <p style={{ color: "rgba(245,230,224,0.4)", fontSize: 14, textAlign: "center", padding: "32px 0" }}>
          No saved dates yet. Hit the ♡ on a date plan to save it!
        </p>
      </div>
    );
  }
  return (
    <div className="saved-panel">
      <div className="saved-header">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Saved Dates</span>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </div>
      <div className="saved-list">
        {saved.map((d, i) => (
          <div key={i} className="saved-item">
            <div className="saved-item-info">
              <div className="saved-item-theme">{d.result.dateTheme || "Date Night"}</div>
              <div className="saved-item-meta">
                {d.result.restaurant?.name} · {d.result.activity?.name}
              </div>
              <div className="saved-item-date">{d.savedAt}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="saved-action-btn" onClick={() => onLoad(d)}>View</button>
              <button className="saved-action-btn danger" onClick={() => onDelete(i)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareModal({ result, onClose }) {
  const [copied, setCopied] = useState(false);

  const text = `🗓️ Our Date Night Plan: ${result.dateTheme || ""}
🍽️ Dinner: ${result.restaurant?.name} — ${result.restaurant?.cuisine} (${result.restaurant?.priceRange})
${result.restaurant?.address ? `📍 ${result.restaurant.address}` : ""}
${result.restaurant?.why || ""}

${result.activity ? `${activityEmoji(result.activity.type)} Activity: ${result.activity.name}
${result.activity?.address ? `📍 ${result.activity.address}` : ""}
${result.activity?.why || ""}` : ""}

Planned with Spin the Romance 💕`;

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function sms() {
    window.open(`sms:?body=${encodeURIComponent(text)}`);
  }

  function whatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Share with Your Partner 💌</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="share-preview">{text}</div>
        <div className="share-btns">
          <button className="share-btn" onClick={copy}>
            {copied ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button className="share-btn" onClick={sms}>💬 Text</button>
          <button className="share-btn" onClick={whatsapp}>📲 WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

export default function DateNightApp() {
  const [budget, setBudget] = useState("moderate");
  const [radius, setRadius] = useState(10);
  const [vibe, setVibe] = useState("classic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("datenight_saved") || "[]"); } catch { return []; }
  });
  const [showSaved, setShowSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [surpriseReveal, setSurpriseReveal] = useState(null); // { vibe, budget, radius }
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [result]);

  useEffect(() => {
    try { localStorage.setItem("datenight_saved", JSON.stringify(saved)); } catch {}
  }, [saved]);

  function getLocation() {
    setLocLoading(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocLoading(false);
      },
      () => {
        setLocError("Couldn't get your location. Please allow location access.");
        setLocLoading(false);
      }
    );
  }

  function saveDate() {
    if (!result) return;
    const entry = {
      result,
      savedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setSaved(prev => [entry, ...prev.slice(0, 19)]);
  }

  function deleteDate(i) {
    setSaved(prev => prev.filter((_, idx) => idx !== i));
  }

  function loadDate(d) {
    setResult(d.result);
    setShowSaved(false);
  }

  async function surpriseMe() {
    if (!location) { setLocError("Please share your location first!"); return; }
    // Randomly pick everything
    const randomVibe = Math.random() < 0.5 ? "classic" : "adventure";
    const randomBudget = BUDGET_OPTIONS[Math.floor(Math.random() * BUDGET_OPTIONS.length)].value;
    const randomRadius = RADIUS_OPTIONS[Math.floor(Math.random() * RADIUS_OPTIONS.length)].value;
    // Reveal what was picked
    setSurpriseReveal({ vibe: randomVibe, budget: randomBudget, radius: randomRadius });
    setVibe(randomVibe);
    setBudget(randomBudget);
    setRadius(randomRadius);
    // Short delay so user sees the reveal, then plan
    await new Promise(r => setTimeout(r, 1800));
    setSurpriseReveal(null);
    await planDateWith({ vibe: randomVibe, budget: randomBudget, radius: randomRadius });
  }

  async function planDate() {
    await planDateWith({ vibe, budget, radius });
  }

  async function planDateWith({ vibe: v, budget: b, radius: r }) {
    if (!location) { setLocError("Please share your location first!"); return; }
    setLoading(true);
    setResult(null);
    setError(null);

    const budgetLabel = BUDGET_OPTIONS.find(opt => opt.value === b)?.desc || "$30–$80";
    const isAdv = v === "adventure";

    const prompt = isAdv
      ? `You are an outdoor adventure date planner. Given coordinates, budget, and radius, plan an exciting outdoor adventure date.

Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
Budget: ${budgetLabel} per person
Radius: Within ${r} miles

Suggest REAL outdoor adventures and a casual/scenic food spot near this location. Use your knowledge of the area.
Adventure ideas: white water rafting, hiking trails, kayaking, rock climbing, zip-lining, mountain biking, scenic walks, paddleboarding, waterfall hikes, nature reserves, state/national parks, canyoning, etc.

Return a JSON object ONLY (no markdown, no explanation) with this structure:
{
  "restaurant": {
    "name": "Casual or scenic eatery name",
    "cuisine": "Type of food",
    "priceRange": "$$ etc",
    "why": "Why this fits the adventure vibe",
    "address": "Address",
    "tip": "One insider tip",
    "bookingUrl": "https://... reservation or website URL if known, else null",
    "bookingLabel": "Reserve a Table or Visit Website"
  },
  "activity": {
    "name": "Adventure name",
    "type": "hiking|rafting|kayaking|climbing|biking|zip-lining|walking|paddleboarding|other",
    "why": "Why this is an epic date adventure",
    "address": "Location or trailhead address",
    "details": ["Difficulty level", "Duration", "What to bring", "Best season"],
    "tip": "One safety or experience tip",
    "bookingUrl": "https://... booking URL if applicable, else null",
    "bookingLabel": "Book the Adventure"
  },
  "dateTheme": "A punchy 3-5 word adventure theme e.g. 'Wild River Romance'"
}`
      : `You are a date night planner. Given a location, budget, and radius, suggest one restaurant and one fun activity for a romantic date.

Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
Budget: ${budgetLabel} per person
Radius: Within ${r} miles

Suggest REAL places near this location using your knowledge of the area. Activity ideas: movies with current showtimes, concerts, axe throwing, escape rooms, bowling, museums, comedy clubs, rooftop bars, wine tasting, painting classes, mini golf, go-karts, arcades, live music venues.

Return a JSON object ONLY (no markdown, no explanation) with this exact structure:
{
  "restaurant": {
    "name": "Restaurant Name",
    "cuisine": "Type of cuisine",
    "priceRange": "$$ or $$$ etc",
    "why": "One fun sentence about why this is great for a date",
    "address": "Street address",
    "tip": "One insider tip",
    "bookingUrl": "https://... OpenTable, Resy, or restaurant website URL if known, else null",
    "bookingLabel": "Reserve a Table"
  },
  "activity": {
    "name": "Activity/Venue Name",
    "type": "movie|concert|axe throwing|escape room|bowling|museum|bar|comedy|painting|other",
    "why": "One fun sentence about why this is perfect for a date",
    "address": "Street address or area",
    "details": ["Detail 1 like hours or price", "Detail 2 like what to expect"],
    "tip": "One insider tip",
    "bookingUrl": "https://... tickets or booking URL if applicable, else null",
    "bookingLabel": "Get Tickets"
  },
  "dateTheme": "A fun 3-5 word theme for the whole date night, e.g. 'Rustic Adventure Evening'"
}`;

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError("Hmm, couldn't plan your date right now. Try again!");
    } finally {
      setLoading(false);
    }
  }

  const isAdventure = vibe === "adventure";
  const revealBudgetLabel = surpriseReveal ? BUDGET_OPTIONS.find(b => b.value === surpriseReveal.budget) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0608; min-height: 100vh; }

        .app {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at 15% 10%, rgba(180,30,30,0.2) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 85%, rgba(100,10,60,0.22) 0%, transparent 55%),
            #0f0608;
          font-family: 'DM Sans', sans-serif;
          color: #f5e6e0;
          padding: 32px 20px 80px;
        }

        .topbar {
          max-width: 640px;
          margin: 0 auto 40px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .topbar-btn {
          padding: 9px 18px;
          border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(245,230,224,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .topbar-btn:hover { border-color: #c0392b; color: #f5e6e0; }

        .header { text-align: center; margin-bottom: 48px; }

        .header-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #c0392b;
          margin-bottom: 14px;
        }

        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(46px, 9vw, 86px);
          font-weight: 900;
          line-height: 0.88;
          color: #f5e6e0;
          letter-spacing: -2px;
        }
        .header h1 em { font-style: italic; color: #c0392b; }

        .header-sub {
          margin-top: 18px;
          font-size: 14px;
          font-weight: 300;
          color: rgba(245,230,224,0.45);
          letter-spacing: 0.5px;
        }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px 28px;
          max-width: 640px;
          margin: 0 auto 18px;
        }

        .section-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(245,230,224,0.35);
          margin-bottom: 14px;
        }

        /* Vibe toggle */
        .vibe-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .vibe-btn {
          padding: 18px 12px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #f5e6e0;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .vibe-btn:hover { border-color: rgba(192,57,43,0.5); }
        .vibe-btn.active { border-color: #c0392b; background: rgba(192,57,43,0.15); }
        .vibe-btn .v-icon { font-size: 26px; margin-bottom: 8px; }
        .vibe-btn .v-label { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; display: block; }
        .vibe-btn .v-desc { font-size: 11px; color: rgba(245,230,224,0.4); margin-top: 4px; }

        /* Budget */
        .budget-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .budget-btn {
          padding: 14px 8px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #f5e6e0;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .budget-btn:hover { border-color: rgba(192,57,43,0.5); }
        .budget-btn.active { border-color: #c0392b; background: rgba(192,57,43,0.16); }
        .budget-btn .b-icon { font-size: 20px; margin-bottom: 5px; }
        .budget-btn .b-label { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; display: block; }
        .budget-btn .b-desc { font-size: 11px; color: rgba(245,230,224,0.4); margin-top: 3px; }

        /* Radius */
        .radius-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .radius-btn {
          padding: 11px 6px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: #f5e6e0;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
        }
        .radius-btn:hover { border-color: rgba(192,57,43,0.5); }
        .radius-btn.active { border-color: #c0392b; background: rgba(192,57,43,0.16); }

        /* Location */
        .loc-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .loc-btn {
          padding: 11px 20px;
          border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: #f5e6e0;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .loc-btn:hover { border-color: #c0392b; }
        .loc-status { font-size: 13px; color: rgba(245,230,224,0.45); }
        .loc-status.ok { color: #27ae60; }
        .loc-status.err { color: #e74c3c; }

        /* Plan button */
        .plan-btn {
          display: block;
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 22px;
          border-radius: 20px;
          border: none;
          background: linear-gradient(135deg, #c0392b 0%, #922b21 100%);
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 700;
          font-style: italic;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 8px 40px rgba(192,57,43,0.38);
          position: relative;
          overflow: hidden;
        }
        .plan-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
        }
        .plan-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 50px rgba(192,57,43,0.52); }
        .plan-btn:active:not(:disabled) { transform: translateY(0); }
        .plan-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Loader */
        .loader-wrap { max-width: 640px; margin: 40px auto; text-align: center; }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.2); }
          70% { transform: scale(1); }
        }
        .heart-pulse { font-size: 52px; animation: heartbeat 1.2s ease-in-out infinite; display: inline-block; }

        /* Results */
        .results-wrap { max-width: 640px; margin: 0 auto; }
        .date-theme { text-align: center; margin-bottom: 24px; }
        .date-theme-label {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(245,230,224,0.3);
          margin-bottom: 8px;
        }
        .date-theme-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-style: italic;
          color: #c0392b;
        }

        .result-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }
        .result-action-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: rgba(245,230,224,0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }
        .result-action-btn:hover { border-color: #c0392b; color: #f5e6e0; background: rgba(192,57,43,0.1); }
        .result-action-btn.saved { border-color: #27ae60; color: #27ae60; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 26px;
          margin-bottom: 14px;
          animation: slideUp 0.5s ease both;
          position: relative;
          overflow: hidden;
        }
        .result-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #c0392b, transparent);
        }
        .result-type-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c0392b;
          margin-bottom: 10px;
        }
        .result-emoji { font-size: 34px; margin-bottom: 8px; }
        .result-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #f5e6e0;
          margin-bottom: 5px;
          line-height: 1.2;
        }
        .result-subtitle {
          font-size: 12px;
          color: rgba(245,230,224,0.45);
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        .result-details { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .result-details li {
          font-size: 13px;
          color: rgba(245,230,224,0.72);
          padding-left: 15px;
          position: relative;
          line-height: 1.5;
        }
        .result-details li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #c0392b;
          font-size: 10px;
          top: 3px;
        }

        .booking-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 14px;
          padding: 9px 18px;
          border-radius: 50px;
          background: rgba(192,57,43,0.18);
          border: 1px solid rgba(192,57,43,0.45);
          color: #f5a89a;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .booking-link:hover { background: rgba(192,57,43,0.3); color: #fff; }

        .again-btn {
          display: block;
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: 1.5px solid rgba(192,57,43,0.35);
          background: transparent;
          color: #c0392b;
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-style: italic;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 6px;
        }
        .again-btn:hover { background: rgba(192,57,43,0.08); border-color: #c0392b; }

        .error-box {
          max-width: 640px;
          margin: 22px auto;
          padding: 18px 22px;
          border-radius: 14px;
          background: rgba(231,76,60,0.1);
          border: 1px solid rgba(231,76,60,0.3);
          color: #e74c3c;
          font-size: 14px;
          text-align: center;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 26px 0;
          font-size: 16px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        /* Saved panel */
        .saved-panel {
          max-width: 640px;
          margin: 0 auto 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          overflow: hidden;
          animation: slideUp 0.3s ease both;
        }
        .saved-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .saved-list { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .saved-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .saved-item-info { flex: 1; min-width: 0; }
        .saved-item-theme { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; color: #c0392b; margin-bottom: 3px; }
        .saved-item-meta { font-size: 12px; color: rgba(245,230,224,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .saved-item-date { font-size: 11px; color: rgba(245,230,224,0.3); margin-top: 3px; }
        .saved-action-btn {
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(245,230,224,0.7);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .saved-action-btn:hover { border-color: #c0392b; color: #f5e6e0; }
        .saved-action-btn.danger:hover { border-color: #e74c3c; color: #e74c3c; background: rgba(231,76,60,0.1); }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(245,230,224,0.6);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover { border-color: #c0392b; color: #f5e6e0; }

        /* Share modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        .modal {
          background: #1a0a0a;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 28px;
          max-width: 480px;
          width: 100%;
          animation: slideUp 0.3s ease both;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .share-preview {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px;
          font-size: 13px;
          color: rgba(245,230,224,0.65);
          line-height: 1.7;
          white-space: pre-wrap;
          margin-bottom: 18px;
          max-height: 220px;
          overflow-y: auto;
        }
        .share-btns { display: flex; gap: 10px; }
        .share-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #f5e6e0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .share-btn:hover { border-color: #c0392b; background: rgba(192,57,43,0.12); }

        /* Surprise Me button */
        .surprise-btn {
          display: block;
          width: 100%;
          max-width: 640px;
          margin: 14px auto 0;
          padding: 18px;
          border-radius: 20px;
          border: 2px dashed rgba(255,215,0,0.35);
          background: rgba(255,215,0,0.05);
          color: #ffd700;
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          font-style: italic;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }
        .surprise-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, transparent 60%);
        }
        .surprise-btn:hover:not(:disabled) {
          border-color: rgba(255,215,0,0.7);
          background: rgba(255,215,0,0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255,215,0,0.18);
        }
        .surprise-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Surprise reveal overlay */
        .surprise-reveal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          flex-direction: column;
          gap: 8px;
          padding: 32px;
        }
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .surprise-reveal-inner {
          text-align: center;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .surprise-dice {
          font-size: 64px;
          display: block;
          margin-bottom: 20px;
          animation: heartbeat 0.7s ease-in-out infinite;
        }
        .surprise-reveal-title {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #ffd700;
          margin-bottom: 24px;
        }
        .surprise-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 24px;
        }
        .surprise-chip {
          padding: 10px 20px;
          border-radius: 50px;
          background: rgba(255,215,0,0.12);
          border: 1.5px solid rgba(255,215,0,0.4);
          color: #ffd700;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .surprise-chip:nth-child(2) { animation-delay: 0.1s; }
        .surprise-chip:nth-child(3) { animation-delay: 0.2s; }
        .surprise-loading {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-style: italic;
          color: rgba(245,230,224,0.55);
        }
      `}</style>

      <div className="app">
        {/* Top bar */}
        <div className="topbar">
          <button className="topbar-btn" onClick={() => setShowSaved(s => !s)}>
            🗂️ Saved Dates {saved.length > 0 && `(${saved.length})`}
          </button>
        </div>

        {/* Header */}
        <header className="header">
          <p className="header-eyebrow">✦ Date Night Planner ✦</p>
          <h1>Spin the<br /><em>Romance</em></h1>
          <p className="header-sub">Set your vibe. Hit the button. Fall in love with the plan.</p>
        </header>

        {/* Saved panel */}
        {showSaved && (
          <SavedDatesPanel
            saved={saved}
            onLoad={loadDate}
            onDelete={deleteDate}
            onClose={() => setShowSaved(false)}
          />
        )}

        {/* Vibe */}
        <div className="card">
          <p className="section-label">🎭 Date Vibe</p>
          <div className="vibe-grid">
            {VIBE_OPTIONS.map(v => (
              <button
                key={v.value}
                className={`vibe-btn ${vibe === v.value ? "active" : ""}`}
                onClick={() => setVibe(v.value)}
              >
                <div className="v-icon">{v.icon}</div>
                <span className="v-label">{v.label}</span>
                <div className="v-desc">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="card">
          <p className="section-label">💰 Budget per person</p>
          <div className="budget-grid">
            {BUDGET_OPTIONS.map(b => (
              <button
                key={b.value}
                className={`budget-btn ${budget === b.value ? "active" : ""}`}
                onClick={() => setBudget(b.value)}
              >
                <div className="b-icon">{b.icon}</div>
                <span className="b-label">{b.label}</span>
                <div className="b-desc">{b.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="card">
          <p className="section-label">📍 Travel radius</p>
          <div className="radius-grid">
            {RADIUS_OPTIONS.map(r => (
              <button
                key={r.value}
                className={`radius-btn ${radius === r.value ? "active" : ""}`}
                onClick={() => setRadius(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <p className="section-label">🗺️ Your location</p>
          <div className="loc-row">
            <button className="loc-btn" onClick={getLocation} disabled={locLoading}>
              {locLoading ? "⏳" : "📡"} {locLoading ? "Getting location..." : location ? "Update Location" : "Share My Location"}
            </button>
            {location && <span className="loc-status ok">✓ Location locked in!</span>}
            {locError && <span className="loc-status err">{locError}</span>}
          </div>
        </div>

        {/* CTA */}
        <button className="plan-btn" onClick={planDate} disabled={loading || !location}>
          {loading
            ? (isAdventure ? "Finding adventure... 🏔️" : "Finding your date... ✨")
            : (isAdventure ? "Plan Our Adventure →" : "Plan Our Date Night →")}
        </button>

        {/* Surprise Me */}
        <button className="surprise-btn" onClick={surpriseMe} disabled={loading || !location}>
          🎲 Surprise Me — Pick Everything Randomly
        </button>

        {loading && (
          <div className="loader-wrap">
            <HeartLoader vibe={vibe} />
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {result && !loading && (
          <div className="results-wrap" ref={resultRef}>
            <div className="divider">{isAdventure ? "🏔️" : "❤️"}</div>

            {result.dateTheme && (
              <div className="date-theme">
                <p className="date-theme-label">Tonight's Theme</p>
                <p className="date-theme-title">{result.dateTheme}</p>
              </div>
            )}

            {/* Save + Share actions */}
            <div className="result-actions">
              <button
                className={`result-action-btn ${saved.some(s => s.result.dateTheme === result.dateTheme) ? "saved" : ""}`}
                onClick={saveDate}
              >
                {saved.some(s => s.result.dateTheme === result.dateTheme) ? "♥ Saved!" : "♡ Save Date"}
              </button>
              <button className="result-action-btn" onClick={() => setShowShare(true)}>
                💌 Share with Partner
              </button>
            </div>

            {result.restaurant && (
              <ResultCard
                emoji="🍽️"
                type={isAdventure ? "Fuel Up Here" : "Dinner Spot"}
                title={result.restaurant.name}
                subtitle={`${result.restaurant.cuisine} · ${result.restaurant.priceRange}${result.restaurant.address ? " · " + result.restaurant.address : ""}`}
                details={[
                  result.restaurant.why,
                  result.restaurant.tip && `💡 ${result.restaurant.tip}`,
                ].filter(Boolean)}
                bookingUrl={result.restaurant.bookingUrl}
                bookingLabel={result.restaurant.bookingLabel}
                delay={0}
              />
            )}

            {result.activity && (
              <ResultCard
                emoji={activityEmoji(result.activity.type)}
                type={isAdventure ? "The Adventure" : "The Activity"}
                title={result.activity.name}
                subtitle={result.activity.address || result.activity.type}
                details={[
                  result.activity.why,
                  ...(result.activity.details || []),
                  result.activity.tip && `💡 ${result.activity.tip}`,
                ].filter(Boolean)}
                bookingUrl={result.activity.bookingUrl}
                bookingLabel={result.activity.bookingLabel}
                delay={150}
              />
            )}

            <button className="again-btn" onClick={planDate}>
              ↻ Spin Again for a Different Date
            </button>
          </div>
        )}
      </div>

      {showShare && result && (
        <ShareModal result={result} onClose={() => setShowShare(false)} />
      )}

      {/* Surprise reveal overlay */}
      {surpriseReveal && (
        <div className="surprise-reveal">
          <div className="surprise-reveal-inner">
            <span className="surprise-dice">🎲</span>
            <p className="surprise-reveal-title">✦ The Universe Decides ✦</p>
            <div className="surprise-chips">
              <span className="surprise-chip">
                {surpriseReveal.vibe === "adventure" ? "🏔️ Wild Adventure" : "🥂 Classic Date Night"}
              </span>
              <span className="surprise-chip">
                {revealBudgetLabel?.icon} {revealBudgetLabel?.label} ({revealBudgetLabel?.desc})
              </span>
              <span className="surprise-chip">
                📍 Within {surpriseReveal.radius} miles
              </span>
            </div>
            <p className="surprise-loading">Finding your fate...</p>
          </div>
        </div>
      )}
    </>
  );
}
