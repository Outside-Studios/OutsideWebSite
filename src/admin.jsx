// Admin panel + Roblox community card + Unreal Engine 5 teaser
// Depends on window.OUTSIDE_I18N, window.OUTSIDE_GAMES (defaults)

const LS_GAMES = "outside_games_v1";
const LS_DEVS = "outside_devs_v1";
const LS_NEWS = "outside_news_v1";
const LS_ADMIN_AUTH = "outside_admin_session_v2"; // stores session expiry timestamp
const LS_ADMIN_HASH = "outside_admin_hash_v2";    // stores sha256 of password
const LS_ADMIN_ATTEMPTS = "outside_admin_attempts";
const LS_ADMIN_LOCKOUT = "outside_admin_lockout";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000;   // 5 minutes
const SESSION_MS = 24 * 60 * 60 * 1000; // 24 hours

// SHA-256 via Web Crypto API (async)
async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// On first load: if no hash stored yet, hash the bootstrap password and store it.
// After that the plaintext is never needed again — change it via the panel.
(async () => {
  if (!localStorage.getItem(LS_ADMIN_HASH)) {
    localStorage.setItem(LS_ADMIN_HASH, await sha256hex("outside2026"));
  }
})();

const PLATFORMS = ["PC", "Mobile", "Xbox", "PlayStation", "Browser"];
const DEV_ENGINES = ["Roblox", "Unreal Engine 5", "Unreal Engine 4", "Unity", "Godot", "Custom"];
const GAME_GENRES = [
  { id: "rpg",          pt: "RPG",            en: "RPG" },
  { id: "action",       pt: "Ação",           en: "Action" },
  { id: "adventure",    pt: "Aventura",       en: "Adventure" },
  { id: "idle",         pt: "Idle",           en: "Idle" },
  { id: "cultivation",  pt: "Cultivo",        en: "Cultivation" },
  { id: "isekai",       pt: "Isekai",         en: "Isekai" },
  { id: "pixelart",     pt: "Pixel Art",      en: "Pixel Art" },
  { id: "simulation",   pt: "Simulação",      en: "Simulation" },
  { id: "strategy",     pt: "Estratégia",     en: "Strategy" },
  { id: "survival",     pt: "Sobrevivência",  en: "Survival" },
  { id: "horror",       pt: "Horror",         en: "Horror" },
  { id: "puzzle",       pt: "Puzzle",         en: "Puzzle" },
  { id: "platformer",   pt: "Plataforma",     en: "Platformer" },
  { id: "fighting",     pt: "Luta",           en: "Fighting" },
  { id: "shooter",      pt: "Shooter",        en: "Shooter" },
  { id: "battleroyale", pt: "Battle Royale",  en: "Battle Royale" },
  { id: "roguelike",    pt: "Roguelike",      en: "Roguelike" },
  { id: "towerdefense", pt: "Tower Defense",  en: "Tower Defense" },
  { id: "farming",      pt: "Fazenda",        en: "Farming" },
  { id: "openworld",    pt: "Mundo Aberto",   en: "Open World" },
  { id: "mmo",          pt: "MMO",            en: "MMO" },
  { id: "sandbox",      pt: "Sandbox",        en: "Sandbox" },
  { id: "sports",       pt: "Esportes",       en: "Sports" },
  { id: "racing",       pt: "Corrida",        en: "Racing" },
  { id: "cardgame",     pt: "Cartas",         en: "Card Game" },
];
const DEV_FOCUS_OPTIONS = [
  { id: "systems",    pt: "Sistemas",      en: "Systems" },
  { id: "gameplay",   pt: "Gameplay",      en: "Gameplay" },
  { id: "mapper",     pt: "Mapper",        en: "Level Design" },
  { id: "gamedesign", pt: "Game Design",   en: "Game Design" },
  { id: "modeling",   pt: "Modelagem",     en: "Modeling" },
  { id: "art2d",      pt: "Arte 2D",       en: "2D Art" },
  { id: "art3d",      pt: "Arte 3D",       en: "3D Art" },
  { id: "ui",         pt: "UI/UX",         en: "UI/UX" },
  { id: "vfx",        pt: "VFX",           en: "VFX" },
  { id: "animation",  pt: "Animação",      en: "Animation" },
  { id: "audio",      pt: "Áudio",         en: "Audio" },
  { id: "narrative",  pt: "Narrativa",     en: "Narrative" },
  { id: "qa",         pt: "QA / Testes",   en: "QA / Testing" },
  { id: "scripter",   pt: "Scripter",      en: "Scripter" },
];

// Default developers
const DEFAULT_DEVS = [
  {
    id: "ruiso",
    name: "Ruiso",
    role: "head",
    avatar: "https://cdn.discordapp.com/avatars/573711473172545547/f260d0376d04d71ca9c4570e5f49b5b2.webp?size=128",
    roblox: "https://www.roblox.com/users/112644440/profile",
    roblox_username: "Ruiso",
    discord: "ruiso_",
    focus: ["systems", "mapper", "gameplay"],
    education_pt: "Formado em Análise e Desenvolvimento de Software",
    education_en: "Degree in Systems Analysis & Software Development",
    engines: ["Roblox", "Unreal Engine 5"],
    cpu: "", gpu: "", ram: "",
    games: ["pixel-cultivation","isekai-idle","eternal-soul-3","ascension","eternal-soul-2","martial-peak","eternal-soul"],
  },
  {
    id: "yato",
    name: "Yato",
    role: "dev",
    avatar: "https://cdn.discordapp.com/avatars/407964795501936663/e70a23368cbcd8df7bb1faae95f6e7c4.webp?size=128",
    roblox: "https://www.roblox.com/users/7907066510/profile",
    roblox_username: "Yato",
    discord: "yato2451",
    focus: ["systems", "modeling", "ui"],
    education_pt: "Formado em Análise e Desenvolvimento de Software",
    education_en: "Degree in Systems Analysis & Software Development",
    engines: ["Roblox"],
    cpu: "", gpu: "", ram: "",
    games: ["pixel-cultivation","isekai-idle","eternal-soul-3","ascension","eternal-soul-2","martial-peak","eternal-soul"],
  },
];

function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (!v) return fallback;
    return JSON.parse(v);
  } catch (e) {
    return fallback;
  }
}
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
const uid = () => Math.random().toString(36).slice(2, 9);

// ----- Roblox Community Card -----
const RobloxCommunity = ({ lang }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <section className="rblx-community">
      <div className="container">
        <div className="rblx-card">
          <div className="rblx-visual">
            <div className="rblx-mark"><span>O</span></div>
          </div>
          <div className="rblx-body">
            <div className="rblx-tag">ROBLOX COMMUNITY</div>
            <div className="rblx-name">Outside Hub</div>
            <p className="rblx-sub">{t.community_roblox_sub}</p>
            <div className="rblx-stats">
              <div className="rblx-stat">
                <div className="rblx-stat-num">1K+</div>
                <div className="rblx-stat-label">{t.community_members_label}</div>
              </div>
              <div className="rblx-stat">
                <div className="rblx-stat-num">1M+</div>
                <div className="rblx-stat-label">{t.community_visits_label}</div>
              </div>
              <div className="rblx-stat">
                <div className="rblx-stat-num">07</div>
                <div className="rblx-stat-label">{t.community_games_label}</div>
              </div>
            </div>
            <a
              className="btn btn-ghost rblx-cta"
              href="https://www.roblox.com/communities/35928033/Outside-Hub#!/about"
              target="_blank"
              rel="noreferrer"
              style={{ width: "fit-content" }}
            >
              {t.community_roblox_cta} <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ----- Unreal Engine 5 Teaser -----
const UnrealTeaser = ({ lang }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <section id="unreal" className="unreal">
      <div className="container">
        <div className="unreal-card">
          <div className="unreal-content">
            <div className="unreal-kicker">
              <span className="dot" />
              {t.unreal_kicker}
            </div>
            <h2 className="unreal-title">{t.unreal_title}</h2>
            <p className="unreal-body">{t.unreal_body}</p>
            <a
              className="btn btn-primary"
              href="https://discord.gg/3EzBhdXEAj"
              target="_blank"
              rel="noreferrer"
              style={{ background: "oklch(0.72 0.2 300)", color: "#fff", boxShadow: "0 10px 40px -10px oklch(0.72 0.2 300 / 0.5)" }}
            >
              {t.unreal_follow} <span className="arrow">→</span>
            </a>
            <div className="unreal-meta">
              <div className="unreal-meta-item">
                <div className="k">ENGINE</div>
                <div className="v">Unreal Engine 5</div>
              </div>
              <div className="unreal-meta-item">
                <div className="k">{lang === "pt" ? "FASE" : "STAGE"}</div>
                <div className="v">{t.unreal_stage}</div>
              </div>
              <div className="unreal-meta-item">
                <div className="k">{lang === "pt" ? "PLATAFORMA" : "PLATFORM"}</div>
                <div className="v">{t.unreal_platform}</div>
              </div>
            </div>
          </div>
          <div className="ue5-visual ue5-corners">
            <div className="ue5-logo">
              <div className="big">UE5</div>
              <div className="sub">// new horizon</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ----- Admin Panel -----
const AdminPanel = ({ open, onClose, games, setGames, devs, setDevs, news, setNews, lang }) => {
  const t = window.OUTSIDE_I18N[lang];

  // Session: stored value is expiry timestamp (ms). Valid if in the future.
  const sessionValid = () => {
    const exp = parseInt(localStorage.getItem(LS_ADMIN_AUTH) || "0");
    return Date.now() < exp;
  };

  const [authed, setAuthed] = React.useState(sessionValid);
  const [pwd, setPwd] = React.useState("");
  const [err, setErr] = React.useState("");
  const [lockoutLeft, setLockoutLeft] = React.useState(0); // seconds remaining
  const [tab, setTab] = React.useState("games");
  const [editing, setEditing] = React.useState(null);
  const [changingPwd, setChangingPwd] = React.useState(false);
  const [cpFields, setCpFields] = React.useState({ cur: "", next: "", confirm: "" });
  const [cpErr, setCpErr] = React.useState("");

  // Tick lockout countdown
  React.useEffect(() => {
    const lockout = parseInt(localStorage.getItem(LS_ADMIN_LOCKOUT) || "0");
    if (Date.now() < lockout) {
      setLockoutLeft(Math.ceil((lockout - Date.now()) / 1000));
      const id = setInterval(() => {
        const rem = Math.ceil((parseInt(localStorage.getItem(LS_ADMIN_LOCKOUT) || "0") - Date.now()) / 1000);
        if (rem <= 0) { clearInterval(id); setLockoutLeft(0); setErr(""); }
        else setLockoutLeft(rem);
      }, 1000);
      return () => clearInterval(id);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) { setEditing(null); setPwd(""); setErr(""); setChangingPwd(false); setCpFields({ cur: "", next: "", confirm: "" }); setCpErr(""); }
  }, [open]);

  const tryLogin = async () => {
    // Check lockout
    const lockout = parseInt(localStorage.getItem(LS_ADMIN_LOCKOUT) || "0");
    if (Date.now() < lockout) {
      const rem = Math.ceil((lockout - Date.now()) / 60000);
      setErr(`Bloqueado. Aguarde ${rem} min.`);
      return;
    }

    const storedHash = localStorage.getItem(LS_ADMIN_HASH);
    const inputHash = await sha256hex(pwd);

    if (inputHash === storedHash) {
      localStorage.removeItem(LS_ADMIN_ATTEMPTS);
      localStorage.removeItem(LS_ADMIN_LOCKOUT);
      localStorage.setItem(LS_ADMIN_AUTH, (Date.now() + SESSION_MS).toString());
      setAuthed(true);
      setErr("");
      setLockoutLeft(0);
    } else {
      const attempts = parseInt(localStorage.getItem(LS_ADMIN_ATTEMPTS) || "0") + 1;
      localStorage.setItem(LS_ADMIN_ATTEMPTS, attempts.toString());
      if (attempts >= MAX_ATTEMPTS) {
        const exp = Date.now() + LOCKOUT_MS;
        localStorage.setItem(LS_ADMIN_LOCKOUT, exp.toString());
        localStorage.removeItem(LS_ADMIN_ATTEMPTS);
        setLockoutLeft(LOCKOUT_MS / 1000);
        setErr("Muitas tentativas incorretas. Bloqueado por 5 minutos.");
      } else {
        const left = MAX_ATTEMPTS - attempts;
        setErr(`${t.admin_wrong} — ${left} tentativa${left !== 1 ? "s" : ""} restante${left !== 1 ? "s" : ""}.`);
        setTimeout(() => setErr(""), 3000);
      }
    }
    setPwd("");
  };

  const logout = () => {
    setAuthed(false);
    localStorage.removeItem(LS_ADMIN_AUTH);
    onClose();
  };

  const doChangePassword = async () => {
    setCpErr("");
    const storedHash = localStorage.getItem(LS_ADMIN_HASH);
    const curHash = await sha256hex(cpFields.cur);
    if (curHash !== storedHash) { setCpErr("Senha atual incorreta."); return; }
    if (cpFields.next.length < 8) { setCpErr("Nova senha: mínimo 8 caracteres."); return; }
    if (cpFields.next !== cpFields.confirm) { setCpErr("As senhas não coincidem."); return; }
    const newHash = await sha256hex(cpFields.next);
    localStorage.setItem(LS_ADMIN_HASH, newHash);
    setChangingPwd(false);
    setCpFields({ cur: "", next: "", confirm: "" });
    alert("Senha alterada com sucesso!");
  };

  const startAddGame = () => setEditing({
    type: "game", isNew: true,
    data: {
      id: uid(), title: "", tag: "", url: "",
      image: "", engine: "Roblox", platforms: ["PC", "Mobile", "Xbox"],
      images: [],
      genres: [],
      status: "live", featured: false,
      hue: 165, hue2: 220,
      desc_pt: "", desc_en: "", year: "2026",
    },
  });
  const startEditGame = (g) => setEditing({ type: "game", isNew: false, data: { ...g } });
  const deleteGame = (id) => {
    if (!confirm(t.admin_confirm_delete)) return;
    setGames(games.filter((g) => g.id !== id));
  };
  const saveGame = (d) => {
    if (editing.isNew) setGames([...games, d]);
    else setGames(games.map((g) => (g.id === d.id ? d : g)));
    setEditing(null);
  };

  const startAddDev = () => setEditing({
    type: "dev", isNew: true,
    data: {
      id: uid(), name: "", role: "dev",
      avatar: "", roblox: "", roblox_username: "", discord: "",
      focus: [],
      education_pt: "Formado em Análise e Desenvolvimento de Software",
      education_en: "Degree in Systems Analysis & Software Development",
      engines: ["Roblox"],
      cpu: "", gpu: "", ram: "",
      games: [],
    },
  });
  const startEditDev = (d) => setEditing({ type: "dev", isNew: false, data: { ...d } });
  const deleteDev = (id) => {
    if (!confirm(t.admin_confirm_delete)) return;
    setDevs(devs.filter((d) => d.id !== id));
  };
  const saveDev = (d) => {
    if (editing.isNew) setDevs([...devs, d]);
    else setDevs(devs.map((x) => (x.id === d.id ? d : x)));
    setEditing(null);
  };

  const startAddNews = () => setEditing({
    type: "news", isNew: true,
    data: {
      id: uid(),
      gameId: "",
      date_pt: "", date_en: "",
      tag: "DEVLOG",
      image: "",
      title_pt: "", title_en: "",
      body_pt: "", body_en: "",
      full_pt: "", full_en: "",
    },
  });
  const startEditNews = (n) => setEditing({ type: "news", isNew: false, data: { ...n } });
  const deleteNews = (id) => {
    if (!confirm(t.admin_confirm_delete)) return;
    setNews(news.filter((n) => n.id !== id));
  };
  const saveNews = (d) => {
    if (editing.isNew) setNews([d, ...news]);
    else setNews(news.map((x) => (x.id === d.id ? d : x)));
    setEditing(null);
  };

  const resetAll = () => {
    if (!confirm(t.admin_confirm_delete)) return;
    localStorage.removeItem(LS_GAMES);
    localStorage.removeItem(LS_DEVS);
    localStorage.removeItem(LS_NEWS);
    setGames(window.OUTSIDE_GAMES.map((g) => ({ ...g })));
    setDevs(DEFAULT_DEVS.map((d) => ({ ...d })));
    setNews(window.OUTSIDE_NEWS.map((n) => ({ ...n })));
  };

  return (
    <div className={`admin-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="admin-window" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <div className="admin-header-left">
            <div className="admin-dot" />
            <div className="admin-header-title">// OUTSIDE ADMIN</div>
            <div className="admin-header-tag">v1.0</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="admin-close" onClick={onClose} title={t.modal_close}>✕</button>
          </div>
        </div>

        {!authed ? (
          <div className="admin-login">
            <div className="admin-login-box">
              <div className="admin-login-icon"><span>◆</span></div>
              <h3>{t.admin_title}</h3>
              <p>{t.admin_login}</p>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !lockoutLeft && tryLogin()}
                placeholder="••••••••"
                autoFocus
                disabled={!!lockoutLeft}
              />
              <div className="error" style={{ minHeight: 18 }}>{err}</div>
              {lockoutLeft > 0 && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "oklch(0.7 0.18 50)", letterSpacing: "0.08em", textAlign: "center" }}>
                  ⏱ {Math.floor(lockoutLeft / 60)}:{String(lockoutLeft % 60).padStart(2, "0")}
                </div>
              )}
              <button className="admin-btn primary" onClick={tryLogin} disabled={!!lockoutLeft}>
                {t.admin_login_btn} →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="admin-tabs">
              <button className={`admin-tab ${tab === "games" ? "active" : ""}`} onClick={() => { setTab("games"); setEditing(null); }}>
                {t.admin_tab_games} ({games.length})
              </button>
              <button className={`admin-tab ${tab === "devs" ? "active" : ""}`} onClick={() => { setTab("devs"); setEditing(null); }}>
                {t.admin_tab_devs} ({devs.length})
              </button>
              <button className={`admin-tab ${tab === "news" ? "active" : ""}`} onClick={() => { setTab("news"); setEditing(null); }}>
                DEVLOGS ({news.length})
              </button>
            </div>
            <div className="admin-body">
              {tab === "games" && (
                <>
                  <div className="admin-toolbar">
                    <button className="admin-btn primary" onClick={startAddGame}>{t.admin_add_game}</button>
                    <button className="admin-btn danger" onClick={resetAll}>{t.admin_reset}</button>
                  </div>
                  {editing?.type === "game" && (
                    <GameForm editing={editing} onSave={saveGame} onCancel={() => setEditing(null)} t={t} />
                  )}
                  <div className="admin-list">
                    {games.length === 0 && <div className="admin-empty">// NO GAMES YET</div>}
                    {games.map((g) => (
                      <div className="admin-row" key={g.id}>
                        <div
                          className="admin-row-mark"
                          style={{ background: `linear-gradient(135deg, oklch(0.5 0.18 ${g.hue}), oklch(0.45 0.16 ${g.hue2}))` }}
                        >
                          {g.title[0] || "?"}
                        </div>
                        <div className="admin-row-info">
                          <div className="admin-row-title">
                            {g.title}{" "}
                            {g.featured && <span style={{ color: "var(--accent)", fontSize: 10, fontFamily: "var(--mono)", marginLeft: 6 }}>★ FEATURED</span>}
                          </div>
                          <div className="admin-row-sub">{(g.genres || []).join(" · ") || g.genre_pt || g.genre_en} · {g.status.toUpperCase()} · {g.year}</div>
                        </div>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" title={t.admin_edit} onClick={() => startEditGame(g)}>✎</button>
                          <button className="admin-icon-btn danger" title={t.admin_delete} onClick={() => deleteGame(g.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "devs" && (
                <>
                  <div className="admin-toolbar">
                    <button className="admin-btn primary" onClick={startAddDev}>{t.admin_add_dev}</button>
                  </div>
                  {editing?.type === "dev" && (
                    <DevForm editing={editing} onSave={saveDev} onCancel={() => setEditing(null)} t={t} games={games} />
                  )}
                  <div className="admin-list">
                    {devs.length === 0 && <div className="admin-empty">// NO DEVELOPERS YET</div>}
                    {devs.map((d) => (
                      <div className="admin-row" key={d.id}>
                        <div
                          className="admin-row-mark"
                          style={{ background: "var(--bg-2)", overflow: "hidden", padding: 0 }}
                        >
                          {d.avatar ? (
                            <img src={d.avatar} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                          ) : d.name[0] || "?"}
                        </div>
                        <div className="admin-row-info">
                          <div className="admin-row-title">{d.name}</div>
                          <div className="admin-row-sub">{d.role === "head" ? "Head Developer" : "Developer"} · {(d.focus || []).join(", ") || (d.focus_pt || "")}</div>
                        </div>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" onClick={() => startEditDev(d)}>✎</button>
                          <button className="admin-icon-btn danger" onClick={() => deleteDev(d.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {tab === "news" && (
                <>
                  <div className="admin-toolbar">
                    <button className="admin-btn primary" onClick={startAddNews}>+ Adicionar Devlog</button>
                  </div>
                  {editing?.type === "news" && (
                    <NewsForm editing={editing} onSave={saveNews} onCancel={() => setEditing(null)} t={t} games={games} />
                  )}
                  <div className="admin-list">
                    {news.length === 0 && <div className="admin-empty">// NO DEVLOGS YET</div>}
                    {news.map((n) => (
                      <div className="admin-row" key={n.id}>
                        <div className="admin-row-mark" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#041812" }}>◆</div>
                        <div className="admin-row-info">
                          <div className="admin-row-title">{n.title_pt || n.title_en}</div>
                          <div className="admin-row-sub">{n.date_pt || n.date_en} · {n.tag}</div>
                        </div>
                        <div className="admin-row-actions">
                          <button className="admin-icon-btn" onClick={() => startEditNews(n)}>✎</button>
                          <button className="admin-icon-btn danger" onClick={() => deleteNews(n.id)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {changingPwd && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(7,11,20,0.92)", zIndex: 10, display: "grid", placeItems: "center", padding: 32 }}>
                <div style={{ width: "100%", maxWidth: 400, background: "var(--panel)", border: "1px solid var(--accent)", borderRadius: 10, padding: 32, display: "grid", gap: 16 }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500, color: "var(--accent)" }}>// ALTERAR SENHA</div>
                  {[
                    { label: "Senha atual", key: "cur" },
                    { label: "Nova senha (mín. 8 chars)", key: "next" },
                    { label: "Confirmar nova senha", key: "confirm" },
                  ].map(({ label, key }) => (
                    <div className="admin-field" key={key}>
                      <label>{label}</label>
                      <input type="password" value={cpFields[key]} onChange={(e) => setCpFields({ ...cpFields, [key]: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && doChangePassword()} />
                    </div>
                  ))}
                  {cpErr && <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "oklch(0.7 0.2 25)", letterSpacing: "0.08em" }}>{cpErr}</div>}
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="admin-btn" onClick={() => { setChangingPwd(false); setCpErr(""); setCpFields({ cur: "", next: "", confirm: "" }); }}>Cancelar</button>
                    <button className="admin-btn primary" onClick={doChangePassword}>Salvar →</button>
                  </div>
                </div>
              </div>
            )}
            {authed && (
              <div className="admin-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button className="admin-text-link" onClick={() => setChangingPwd(true)}>🔑 Alterar senha</button>
                <button className="admin-text-link" onClick={logout}>← {t.admin_logout}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NewsForm = ({ editing, onSave, onCancel, t, games }) => {
  const [d, setD] = React.useState({ gameId: "", ...editing.data });
  const up = (k, v) => setD({ ...d, [k]: v });
  return (
    <div className="admin-form">
      <div className="admin-form-title">{editing.isNew ? "+ Adicionar Devlog" : t.admin_edit}</div>
      <div className="admin-form-grid">
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Jogo relacionado</label>
          <select value={d.gameId || ""} onChange={(e) => up("gameId", e.target.value)}>
            <option value="">— Geral / Studio —</option>
            {(games || []).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label>Data (PT) ex: ABR 2026</label>
          <input value={d.date_pt} onChange={(e) => up("date_pt", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Data (EN) ex: APR 2026</label>
          <input value={d.date_en} onChange={(e) => up("date_en", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Tag</label>
          <select value={d.tag || "DEVLOG"} onChange={(e) => up("tag", e.target.value)}>
            <option value="DEVLOG">DEVLOG</option>
            <option value="UPDATE">UPDATE</option>
            <option value="PATCH">PATCH</option>
            <option value="HOTFIX">HOTFIX</option>
            <option value="EVENT">EVENT</option>
            <option value="STUDIO">STUDIO</option>
            <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
          </select>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Imagem de capa (URL — opcional)</label>
          <input value={d.image || ""} onChange={(e) => up("image", e.target.value)} placeholder="https://... (imagem que aparece no topo do devlog)" />
          {d.image && (
            <div style={{ marginTop: 8, height: 120, borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={d.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.opacity = 0.2; }} />
            </div>
          )}
        </div>
        <div className="admin-field">
          <label>Título (PT) *</label>
          <input value={d.title_pt} onChange={(e) => up("title_pt", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Title (EN)</label>
          <input value={d.title_en} onChange={(e) => up("title_en", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Resumo (PT) — aparece no card</label>
          <textarea rows={2} value={d.body_pt} onChange={(e) => up("body_pt", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Summary (EN)</label>
          <textarea rows={2} value={d.body_en} onChange={(e) => up("body_en", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Conteúdo completo (PT) — aparece ao clicar em "Ler mais"</label>
          <textarea rows={8} value={d.full_pt} onChange={(e) => up("full_pt", e.target.value)} placeholder="Texto completo do devlog. Quebras de linha são preservadas." />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Full content (EN)</label>
          <textarea rows={8} value={d.full_en} onChange={(e) => up("full_en", e.target.value)} />
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn" onClick={onCancel}>{t.admin_cancel}</button>
        <button className="admin-btn primary" onClick={() => d.title_pt && onSave(d)}>{t.admin_save}</button>
      </div>
    </div>
  );
};

const GameForm = ({ editing, onSave, onCancel, t }) => {
  const [d, setD] = React.useState(editing.data);
  const up = (k, v) => setD({ ...d, [k]: v });
  return (
    <div className="admin-form">
      <div className="admin-form-title">{editing.isNew ? t.admin_add_game : t.admin_edit}</div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Title *</label>
          <input value={d.title} onChange={(e) => up("title", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Tag (ex: [NEW YEAR])</label>
          <input value={d.tag} onChange={(e) => up("tag", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>URL (Roblox ou outra plataforma — opcional)</label>
          <input value={d.url} onChange={(e) => up("url", e.target.value)} placeholder="https://..." />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Banner / Imagem de capa (URL)</label>
          <input value={d.image || ""} onChange={(e) => up("image", e.target.value)} placeholder="https://... (cole uma URL de imagem — deixe vazio para usar placeholder)" />
          {d.image && (
            <div style={{ marginTop: 8, height: 120, borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={d.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.opacity = 0.2; }} />
            </div>
          )}
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Imagens do carrossel (screenshots)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(d.images || []).map((img, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  style={{ flex: 1 }}
                  value={img}
                  onChange={(e) => {
                    const imgs = [...(d.images || [])];
                    imgs[i] = e.target.value;
                    up("images", imgs);
                  }}
                  placeholder="https://..."
                />
                <button
                  className="admin-icon-btn danger"
                  type="button"
                  onClick={() => up("images", (d.images || []).filter((_, j) => j !== i))}
                >✕</button>
              </div>
            ))}
            <button
              className="admin-btn"
              type="button"
              style={{ alignSelf: "flex-start", marginTop: 4 }}
              onClick={() => up("images", [...(d.images || []), ""])}
            >+ Adicionar imagem</button>
          </div>
        </div>
        <div className="admin-field">
          <label>Engine</label>
          <select value={d.engine || "Roblox"} onChange={(e) => up("engine", e.target.value)}>
            <option value="Roblox">Roblox</option>
            <option value="Unreal Engine 5">Unreal Engine 5</option>
            <option value="Unreal Engine 4">Unreal Engine 4</option>
            <option value="Unity">Unity</option>
            <option value="Godot">Godot</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Plataformas suportadas</label>
          <div className="platform-checks">
            {PLATFORMS.map(p => (
              <label key={p} className="platform-check-item">
                <input
                  type="checkbox"
                  checked={(d.platforms || []).includes(p)}
                  onChange={(e) => {
                    const cur = d.platforms || [];
                    up("platforms", e.target.checked ? [...cur, p] : cur.filter(x => x !== p));
                  }}
                />
                {p}
              </label>
            ))}
          </div>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Gêneros</label>
          <div className="platform-checks">
            {GAME_GENRES.map(g => (
              <label key={g.id} className="platform-check-item">
                <input
                  type="checkbox"
                  checked={(d.genres || []).includes(g.id)}
                  onChange={() => {
                    const cur = d.genres || [];
                    up("genres", cur.includes(g.id) ? cur.filter(x => x !== g.id) : [...cur, g.id]);
                  }}
                />
                {g.pt}
              </label>
            ))}
          </div>
        </div>
        <div className="admin-field">
          <label>Status</label>
          <select value={d.status} onChange={(e) => up("status", e.target.value)}>
            <option value="live">LIVE</option>
            <option value="soon">SOON</option>
            <option value="classic">CLASSIC</option>
          </select>
        </div>
        <div className="admin-field">
          <label>Year</label>
          <input value={d.year} onChange={(e) => up("year", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Hue primary (0-360)</label>
          <input type="number" min="0" max="360" value={d.hue} onChange={(e) => up("hue", +e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Hue secondary (0-360)</label>
          <input type="number" min="0" max="360" value={d.hue2} onChange={(e) => up("hue2", +e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Description (PT)</label>
          <textarea rows={3} value={d.desc_pt} onChange={(e) => up("desc_pt", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Description (EN)</label>
          <textarea rows={3} value={d.desc_en} onChange={(e) => up("desc_en", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1", flexDirection: "row", display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            id={`feat-${d.id}`}
            checked={!!d.featured}
            onChange={(e) => up("featured", e.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <label htmlFor={`feat-${d.id}`} style={{ cursor: "pointer" }}>★ FEATURED (destaque no topo)</label>
        </div>
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn" onClick={onCancel}>{t.admin_cancel}</button>
        <button className="admin-btn primary" onClick={() => d.title && onSave(d)}>{t.admin_save}</button>
      </div>
    </div>
  );
};

const DevForm = ({ editing, onSave, onCancel, t, games }) => {
  const [d, setD] = React.useState({ engines: ["Roblox"], games: [], ...editing.data });
  const up = (k, v) => setD({ ...d, [k]: v });
  const toggleEngine = (name) => {
    const cur = d.engines || [];
    up("engines", cur.includes(name) ? cur.filter(x => x !== name) : [...cur, name]);
  };
  const toggleGame = (id) => {
    const cur = d.games || [];
    up("games", cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  };
  return (
    <div className="admin-form">
      <div className="admin-form-title">{editing.isNew ? t.admin_add_dev : t.admin_edit}</div>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Name *</label>
          <input value={d.name} onChange={(e) => up("name", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Role</label>
          <select value={d.role} onChange={(e) => up("role", e.target.value)}>
            <option value="head">Head Developer</option>
            <option value="dev">Developer</option>
          </select>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Avatar URL</label>
          <input value={d.avatar} onChange={(e) => up("avatar", e.target.value)} placeholder="https://..." />
        </div>
        <div className="admin-field">
          <label>Roblox profile URL</label>
          <input value={d.roblox} onChange={(e) => up("roblox", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Roblox username</label>
          <input value={d.roblox_username || ""} onChange={(e) => up("roblox_username", e.target.value)} placeholder="ex: Ruiso" />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Discord (usuário, ex: ruiso_)</label>
          <input value={d.discord || ""} onChange={(e) => up("discord", e.target.value)} placeholder="username" />
        </div>
        <div className="admin-field">
          <label>CPU</label>
          <input value={d.cpu || ""} onChange={(e) => up("cpu", e.target.value)} placeholder="ex: Ryzen 5 5600X" />
        </div>
        <div className="admin-field">
          <label>GPU</label>
          <input value={d.gpu || ""} onChange={(e) => up("gpu", e.target.value)} placeholder="ex: RTX 3060" />
        </div>
        <div className="admin-field">
          <label>RAM</label>
          <input value={d.ram || ""} onChange={(e) => up("ram", e.target.value)} placeholder="ex: 16 GB" />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Funções</label>
          <div className="platform-checks">
            {DEV_FOCUS_OPTIONS.map(f => (
              <label key={f.id} className="platform-check-item">
                <input
                  type="checkbox"
                  checked={(d.focus || []).includes(f.id)}
                  onChange={() => {
                    const cur = d.focus || [];
                    up("focus", cur.includes(f.id) ? cur.filter(x => x !== f.id) : [...cur, f.id]);
                  }}
                />
                {f.pt}
              </label>
            ))}
          </div>
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Education (PT)</label>
          <input value={d.education_pt} onChange={(e) => up("education_pt", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Education (EN)</label>
          <input value={d.education_en} onChange={(e) => up("education_en", e.target.value)} />
        </div>
        <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
          <label>Engines</label>
          <div className="platform-checks">
            {DEV_ENGINES.map(e => (
              <label key={e} className="platform-check-item">
                <input
                  type="checkbox"
                  checked={(d.engines || []).includes(e)}
                  onChange={() => toggleEngine(e)}
                />
                {e}
              </label>
            ))}
          </div>
        </div>
        {games && games.length > 0 && (
          <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
            <label>Projetos</label>
            <div className="platform-checks">
              {games.map(g => (
                <label key={g.id} className="platform-check-item">
                  <input
                    type="checkbox"
                    checked={(d.games || []).includes(g.id)}
                    onChange={() => toggleGame(g.id)}
                  />
                  {g.title}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="admin-form-actions">
        <button className="admin-btn" onClick={onCancel}>{t.admin_cancel}</button>
        <button className="admin-btn primary" onClick={() => d.name && onSave(d)}>{t.admin_save}</button>
      </div>
    </div>
  );
};

// expose
Object.assign(window, {
  RobloxCommunity, UnrealTeaser, AdminPanel,
  DEFAULT_DEVS, DEV_FOCUS_OPTIONS, GAME_GENRES, LS_GAMES, LS_DEVS, LS_NEWS,
  loadLS, saveLS,
});
