// Main React app for Outside Studio website
const { useState, useEffect, useRef } = React;

// Helper: get current language (persisted)
const getLang = () => localStorage.getItem("outside_lang") || "pt";
const setLangLS = (l) => localStorage.setItem("outside_lang", l);

// Placeholder art generator — subtle striped gradient with game name
const PlaceholderArt = ({ game, large }) => {
  if (game.image) {
    return (
      <div className="ph-art">
        <img
          src={game.image}
          alt={game.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(6, 17, 30, 0.85) 100%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", alignSelf: "flex-end", width: "100%", padding: large ? 32 : 16 }}>
          <div className="sublabel" style={{ textAlign: large ? "left" : "center" }}>{game.tag || "ROBLOX EXPERIENCE"}</div>
        </div>
      </div>
    );
  }
  const h1 = game.hue;
  const h2 = game.hue2;
  return (
    <div className="ph-art">
      <div
        className="bg"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, oklch(0.55 0.2 ${h1} / 0.9), transparent 60%),
            radial-gradient(ellipse at 80% 80%, oklch(0.5 0.18 ${h2} / 0.9), transparent 60%),
            linear-gradient(135deg, oklch(0.22 0.08 ${h1}), oklch(0.15 0.06 ${h2}))
          `,
        }}
      />
      <div className="stripes" />
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div className="label" style={{ fontSize: large ? 48 : 28 }}>
          {game.title}
        </div>
        <div className="sublabel">{game.tag || "ROBLOX EXPERIENCE"}</div>
      </div>
    </div>
  );
};

const ETAG_CLASS = {
  "Roblox": "etag-roblox",
  "Unreal Engine 5": "etag-ue5",
  "Unreal Engine 4": "etag-ue5",
  "Unity": "etag-unity",
  "Godot": "etag-godot",
  "Custom": "etag-custom",
};
const ENGINE_LABEL = {
  "Roblox": "Roblox",
  "Unreal Engine 5": "UE5",
  "Unreal Engine 4": "UE4",
  "Unity": "Unity",
  "Godot": "Godot",
  "Custom": "Custom",
};
const EngineTag = ({ engine }) => {
  const e = engine || "Roblox";
  return <span className={`etag ${ETAG_CLASS[e] || "etag-custom"}`}>{ENGINE_LABEL[e] || e}</span>;
};

const PLATFORM_ICONS = {
  PC: <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="1" width="12" height="9" rx="1.2"/><path d="M4 13h6M7 10v3"/></svg>,
  Mobile: <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3.5" y="1" width="7" height="12" rx="1.5"/><circle cx="7" cy="11" r="0.6" fill="currentColor"/></svg>,
  Xbox: <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M4 5l6 4M10 5l-6 4"/></svg>,
  PlayStation: <svg viewBox="0 0 14 14" width="10" height="10" fill="currentColor"><path d="M5.2 2v9.1l2 .9V4c0-.4.2-.6.5-.5.4.1.5.5.5 1v3.1c1.2.5 2.1 0 2.1-1.5 0-1.6-.7-2.4-2.1-2.9L5.2 2zM1 10.2l2.5.8V9.4L1 8.6v1.6zm10.5-1.3c-1-.4-2.2-.5-3.2-.2v1.2l2 .7c.4.1.5.4.2.6-.3.2-.8.1-1.2 0L7 10.6v1.2c.5.2 1 .3 1.5.3.8 0 1.6-.2 2-.6.6-.5.5-1.2 0-1.6z"/></svg>,
  Browser: <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="5.5"/><path d="M1.5 7h11M7 1.5a8 8 0 010 11M7 1.5a8 8 0 000 11"/></svg>,
};
const PlatformBadges = ({ platforms }) => {
  const known = (platforms || []).filter(p => p in PLATFORM_ICONS);
  if (known.length === 0) return null;
  return (
    <div className="platform-badges">
      {known.map(p => (
        <span key={p} className="pbadge" title={p}>
          {PLATFORM_ICONS[p]}{p}
        </span>
      ))}
    </div>
  );
};

const genreLabel = (game, lang) => {
  const opts = window.GAME_GENRES || [];
  const ids = game.genres && game.genres.length > 0 ? game.genres : null;
  if (ids) return ids.map(id => { const o = opts.find(g => g.id === id); return o ? (lang === "pt" ? o.pt : o.en) : id; }).join(" · ");
  return lang === "pt" ? (game.genre_pt || "") : (game.genre_en || game.genre_pt || "");
};

const LogoMark = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className="logo-svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="olg-stroke" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--accent)" />
        <stop offset="1" stopColor="var(--accent-2)" />
      </linearGradient>
      <linearGradient id="olg-fill" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--accent)" stopOpacity="0.4" />
        <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    {/* outer bracket frame */}
    <path d="M 8 4 H 4 V 12" stroke="url(#olg-stroke)" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M 40 4 H 44 V 12" stroke="url(#olg-stroke)" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M 8 44 H 4 V 36" stroke="url(#olg-stroke)" strokeWidth="1.5" strokeLinecap="square" />
    <path d="M 40 44 H 44 V 36" stroke="url(#olg-stroke)" strokeWidth="1.5" strokeLinecap="square" />
    {/* rotated square — portal */}
    <g transform="rotate(45 24 24)">
      <rect x="10" y="10" width="28" height="28" stroke="url(#olg-stroke)" strokeWidth="1.3" fill="url(#olg-fill)" />
      <rect x="16" y="16" width="16" height="16" stroke="var(--accent-2)" strokeOpacity="0.7" strokeWidth="1" fill="none" />
    </g>
    {/* center O */}
    <circle cx="24" cy="24" r="4.5" stroke="var(--accent)" strokeWidth="1.6" fill="none" />
    <circle cx="24" cy="24" r="1.8" fill="var(--accent)" />
    {/* arrow breaking out — top-right */}
    <path d="M 31 17 L 38 10 M 38 10 H 33 M 38 10 V 15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" fill="none" />
  </svg>
);

const Logo = () => (
  <div className="logo">
    <LogoMark />
    <div className="logo-text">
      Out<span>side</span>
    </div>
  </div>
);

const Nav = ({ lang, setLang }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Logo />
        <div className="nav-links">
          <a href="#games">{t.nav_games}</a>
          <a href="#team">{t.nav_team}</a>
          <a href="#goals">{t.nav_goals}</a>
          <a href="#news">{t.nav_news}</a>
          <a href="#community">{t.nav_community}</a>
        </div>
        <div className="nav-actions">
          <button className="lang-toggle" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>
            {lang === "pt" ? "EN" : "PT"}
          </button>
          <a className="btn btn-primary" href={(window.OUTSIDE_CONFIG||{}).discordUrl||"#"} target="_blank" rel="noreferrer">
            Discord
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = ({ lang }) => {
  const t = window.OUTSIDE_I18N[lang];
  const titleBefore = lang === "pt" ? "Jogos são mais do que" : "Games are more than";
  const titleHL = lang === "pt" ? "entretenimento." : "entertainment.";

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-kicker">
            <span className="dot" />
            {t.hero_kicker}
          </div>
          <h1 className="hero-title">
            {titleBefore} <br />
            <span className="hl">{titleHL}</span>
          </h1>
          <p className="hero-sub">{t.hero_sub}</p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#games">
              {t.hero_cta_play}
              <span className="arrow">→</span>
            </a>
            <a
              className="btn btn-ghost"
              href={(window.OUTSIDE_CONFIG||{}).discordUrl||"#"}
              target="_blank"
              rel="noreferrer"
            >
              {t.hero_cta_discord}
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">07</div>
              <div className="hero-stat-label">{t.hero_stat_games}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">02</div>
              <div className="hero-stat-label">{t.hero_stat_team}</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">∞</div>
              <div className="hero-stat-label">{t.hero_stat_community}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-frame">
        <div className="hero-terminal">
          <div className="hero-terminal-header">
            <span /><span /><span />
          </div>
          <pre>
<span className="tcom">// studio.config</span>{"\n"}
<span className="tkey">name</span>: <span className="tstr">"Outside"</span>{"\n"}
<span className="tkey">engines</span>: [{"\n"}
  <span className="tstr">"Roblox"</span>,{"\n"}
  <span className="tstr">"Unreal Engine 5"</span>{"\n"}
]{"\n"}
<span className="tkey">founded</span>: <span className="tnum">2022</span>{"\n"}
<span className="tkey">genres</span>: [{"\n"}
  <span className="tstr">"cultivation"</span>,{"\n"}
  <span className="tstr">"rpg"</span>, <span className="tstr">"idle"</span>{"\n"}
]{"\n"}
<span className="tkey">roblox_titles</span>: <span className="tnum">7</span>{"\n"}
<span className="tkey">ue5_project</span>: <span className="tstr">"in dev"</span>{"\n"}
<span className="tkey">status</span>: <span className="tstr">"shipping"</span>{"\n"}
<span className="tcom">// next: Pixel Cultivation</span>
<span className="tcur" />
          </pre>
        </div>
      </div>
    </section>
  );
};

const GameCard = ({ game, lang, onOpen, stats }) => {
  const t = window.OUTSIDE_I18N[lang];
  const statusMap = {
    live: t.games_status_live,
    soon: t.games_status_soon,
    classic: t.games_status_classic,
  };
  return (
    <div className="game-card" onClick={() => onOpen(game)}>
      <div className="game-art">
        <PlaceholderArt game={game} />
        <div className={`game-status ${game.status}`}>
          <span className="dot" /> {statusMap[game.status]}
        </div>
        <div className="game-year">{game.year}</div>
        <div className="game-engine-overlay"><EngineTag engine={game.engine} /></div>
      </div>
      <div className="game-body">
        <div className="game-title">{game.title}</div>
        <div className="game-genre">
          {genreLabel(game, lang)}
        </div>
        <PlatformBadges platforms={game.platforms} />
        {stats != null && (
          <div className="game-active-users">
            <span className="game-playing-dot" />
            <span>{stats.playing != null ? stats.playing.toLocaleString() : "—"}</span>
            <span className="game-active-label">{lang === "pt" ? "usuários ativos" : "active users"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FeaturedCard = ({ game, lang, onOpen, stats }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <div className="featured-card">
      <div className="featured-art">
        <PlaceholderArt game={game} large />
      </div>
      <div className="featured-body">
        <div>
          <div className="featured-badge">
            <span className="dot" /> {t.games_featured}
          </div>
          <h3 className="featured-title">{game.title}</h3>
          {stats != null && (
            <div className="featured-playing">
              <span className="game-playing-dot" />
              <strong>{stats.playing != null ? stats.playing.toLocaleString() : "—"}</strong>
              {lang === "pt" ? " usuários ativos" : " active users"}
            </div>
          )}
          <div className="featured-tag">{genreLabel(game, lang)}</div>
          <div className="featured-meta-row">
            <EngineTag engine={game.engine} />
            <PlatformBadges platforms={game.platforms} />
          </div>
          <p className="featured-desc">{lang === "pt" ? game.desc_pt : game.desc_en}</p>
        </div>
        <div className="featured-ctas">
          {game.url && (
            <a className="btn btn-primary" href={game.url} target="_blank" rel="noreferrer">
              {t.games_play} <span className="arrow">→</span>
            </a>
          )}
          <button className="btn btn-ghost" onClick={() => onOpen(game)}>
            {t.games_details}
          </button>
        </div>
      </div>
    </div>
  );
};

// Extract Roblox place ID from a game URL
const getPlaceId = (url) => (url || '').match(/roblox\.com\/games\/(\d+)/)?.[1];

const Games = ({ lang, onOpen, games, robloxStats = {} }) => {
  const t = window.OUTSIDE_I18N[lang];
  const featured = games.find((g) => g.featured);
  const others = games.filter((g) => !g.featured);

  return (
    <section id="games">
      <div className="container">
        <div className="games-head section-head">
          <div>
            <div className="kicker">{t.games_kicker}</div>
            <h2 className="section-title">{t.games_title}</h2>
            <p className="section-sub">{t.games_sub}</p>
          </div>
        </div>
        {featured && <FeaturedCard game={featured} lang={lang} onOpen={onOpen} stats={robloxStats[getPlaceId(featured.url)]} />}
        <div className="games-grid">
          {others.map((g) => (
            <GameCard key={g.id} game={g} lang={lang} onOpen={onOpen} stats={robloxStats[getPlaceId(g.url)]} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamCard = ({ member, lang, allGames }) => {
  const t = window.OUTSIDE_I18N[lang];
  const focusOpts = window.DEV_FOCUS_OPTIONS || [];
  const focusIds = member.focus && Array.isArray(member.focus) ? member.focus : [];
  const focusLabels = focusIds.map(id => {
    const opt = focusOpts.find(f => f.id === id);
    return opt ? (lang === "pt" ? opt.pt : opt.en) : id;
  });
  const edu = lang === "pt" ? (member.education_pt || t.team_education) : (member.education_en || t.team_education);
  const projLabel = lang === "pt" ? "PROJETOS" : "PROJECTS";
  const memberGames = (member.games || [])
    .map(id => (allGames || []).find(g => g.id === id))
    .filter(Boolean);
  return (
    <div className="team-card">
      <div className="team-head">
        <div className="team-avatar">
          {member.avatar && <img src={member.avatar} alt={member.name} onError={(e) => { e.target.style.display = "none"; }} />}
        </div>
        <div>
          <div className="team-name">{member.name}</div>
          <div className="team-role">{member.role === "head" ? t.team_role_head : t.team_role_dev}</div>
        </div>
      </div>
      <p className="team-body">{edu}.</p>
      <div className="team-specs">
        <div className="team-spec">
          <span className="k">ROLE</span>
          <span className="v">{member.role === "head" ? "Head Developer" : "Developer"}</span>
        </div>
        <div className="team-spec">
          <span className="k">ENGINE</span>
          <span className="v" style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {(member.engines && member.engines.length > 0 ? member.engines : ["Roblox"]).map(e => (
              <EngineTag key={e} engine={e} />
            ))}
          </span>
        </div>
        {focusLabels.length > 0 && (
          <div className="team-spec team-spec-focus">
            <span className="k">FOCUS</span>
            <span className="v" style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
              {focusLabels.map(l => <span key={l} className="focus-chip">{l}</span>)}
            </span>
          </div>
        )}
      </div>
      {(member.cpu || member.gpu || member.ram) && (
        <div className="team-setup">
          <div className="team-setup-label">SETUP</div>
          <div className="team-setup-list">
            {member.cpu && <div className="team-setup-row"><span className="k">CPU</span><span className="v">{member.cpu}</span></div>}
            {member.gpu && <div className="team-setup-row"><span className="k">GPU</span><span className="v">{member.gpu}</span></div>}
            {member.ram && <div className="team-setup-row"><span className="k">RAM</span><span className="v">{member.ram}</span></div>}
          </div>
        </div>
      )}
      {memberGames.length > 0 && (
        <div className="team-projects">
          <div className="team-projects-label">{projLabel}</div>
          <div className="team-projects-chips">
            {memberGames.map(g => (
              <a
                key={g.id}
                className="proj-chip"
                href={g.url || "#games"}
                target={g.url ? "_blank" : "_self"}
                rel="noreferrer"
                style={{ "--chip-hue": g.hue }}
              >
                {g.title}
              </a>
            ))}
          </div>
        </div>
      )}
      {(member.roblox || member.discord) && (
        <div className="team-links">
          <div className="team-links-label">{lang === "pt" ? "CONTATO" : "CONTACT"}</div>
          {member.roblox && (
            <a className="team-link" href={member.roblox} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{ color: "oklch(0.82 0.16 165)", flexShrink: 0 }}>
                <path d="M4.597 2L2 16.799l13.403 3.201L18 4.198 4.597 2zm7.8 10.6l-3.198-.764.763-3.197 3.199.763-.764 3.198z"/>
              </svg>
              {member.roblox_username || member.name}
            </a>
          )}
          {member.discord && (
            <a className="team-link" href={`https://discord.com/users/${member.discord}`} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{ color: "oklch(0.72 0.18 265)", flexShrink: 0 }}>
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.021.012.042.028.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .028-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              {member.discord}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const Team = ({ lang, members, games }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <section id="team">
      <div className="container">
        <div className="section-head">
          <div className="kicker">{t.team_kicker}</div>
          <h2 className="section-title">{t.team_title}</h2>
          <p className="section-sub">{t.team_sub}</p>
        </div>
        <div className="team-grid">
          {members.map((m) => <TeamCard key={m.id || m.name} member={m} lang={lang} allGames={games} />)}
        </div>
      </div>
    </section>
  );
};

const Goals = ({ lang }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <section id="goals">
      <div className="container">
        <div className="section-head">
          <div className="kicker">{t.goals_kicker}</div>
          <h2 className="section-title">{t.goals_title}</h2>
        </div>
        <div className="goals-layout">
          <div className="goals-body">{t.goals_body}</div>
          <div className="goals-pillars">
            {[
              { n: "01", t: t.goals_pillar1_t, b: t.goals_pillar1_b },
              { n: "02", t: t.goals_pillar2_t, b: t.goals_pillar2_b },
              { n: "03", t: t.goals_pillar3_t, b: t.goals_pillar3_b },
            ].map((p) => (
              <div className="pillar" key={p.n}>
                <div className="pillar-num">// {p.n}</div>
                <div className="pillar-title">{p.t}</div>
                <div className="pillar-body">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const NEWS_LIMIT = 6;
const News = ({ lang, items, onOpen, games }) => {
  const t = window.OUTSIDE_I18N[lang];
  const visible = items.slice(0, NEWS_LIMIT);
  return (
    <section id="news">
      <div className="container">
        <div className="section-head">
          <div className="kicker">{t.news_kicker}</div>
          <h2 className="section-title">{t.news_title}</h2>
        </div>
        <div className="news-grid">
          {visible.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 60, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--mono)", letterSpacing: "0.08em" }}>
              // NO DEVLOGS YET
            </div>
          )}
          {visible.map((n, i) => (
            <div className="news-card" key={n.id || i} onClick={() => onOpen(n)} style={{ cursor: "pointer" }}>
              {n.image && (
                <div className="news-image">
                  <img src={n.image} alt={lang === "pt" ? n.title_pt : n.title_en}
                    onError={(e) => { e.target.parentElement.style.display = "none"; }} />
                </div>
              )}
              <div className="news-meta">
                <span>{lang === "pt" ? n.date_pt : n.date_en}</span>
                <span className="news-tag">{n.tag}</span>
                {n.gameId && (
                  <span className="news-game-badge">
                    {((games || []).find(g => g.id === n.gameId) || {}).title || n.gameId}
                  </span>
                )}
              </div>
              <div className="news-title">{lang === "pt" ? n.title_pt : n.title_en}</div>
              <p className="news-body">{lang === "pt" ? n.body_pt : n.body_en}</p>
              <span className="news-read">{t.news_read} →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsModal = ({ item, lang, onClose }) => {
  const t = window.OUTSIDE_I18N[lang];
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!item) return <div className="modal-backdrop" />;
  const body = lang === "pt" ? (item.full_pt || item.body_pt) : (item.full_en || item.body_en);
  return (
    <div className="modal-backdrop open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        {item.image && (
          <div style={{ width: "100%", height: 280, overflow: "hidden", position: "relative", borderBottom: "1px solid var(--border)" }}>
            <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.parentElement.style.display = "none"; }} />
            <button className="modal-close" onClick={onClose} style={{ top: 16, right: 16, position: "absolute", zIndex: 3 }}>✕</button>
          </div>
        )}
        <div style={{ padding: 40, position: "relative" }}>
          {!item.image && <button className="modal-close" onClick={onClose} style={{ top: 16, right: 16 }}>✕</button>}
          <div style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: 18 }}>
            <span>{lang === "pt" ? item.date_pt : item.date_en}</span>
            <span style={{ padding: "4px 8px", background: "rgba(108, 211, 255, 0.08)", color: "var(--accent-2)", borderRadius: 3 }}>{item.tag}</span>
          </div>
          <h3 className="modal-title">{lang === "pt" ? item.title_pt : item.title_en}</h3>
          <div style={{ color: "var(--text-dim)", fontSize: 16, lineHeight: 1.75, marginTop: 24, whiteSpace: "pre-wrap" }}>{body}</div>
        </div>
      </div>
    </div>
  );
};

const Community = ({ lang }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <section id="community" className="community">
      <div className="container">
        <div className="community-panel">
          <div>
            <div className="kicker">{t.community_kicker}</div>
            <h2 className="section-title">{t.community_title}</h2>
            <p className="community-body">{t.community_sub}</p>
            <a className="btn btn-primary" href={(window.OUTSIDE_CONFIG||{}).discordUrl||"#"} target="_blank" rel="noreferrer">
              {t.community_cta} <span className="arrow">→</span>
            </a>
          </div>
          <div className="community-stats">
            <div className="community-stat">
              <div className="community-stat-num">24/7</div>
              <div className="community-stat-label">
                {lang === "pt" ? "Comunidade ativa" : "Active community"}
              </div>
            </div>
            <div className="community-stat">
              <div className="community-stat-num">07</div>
              <div className="community-stat-label">
                {lang === "pt" ? "Jogos no catálogo" : "Games in catalog"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = ({ lang, games }) => {
  const t = window.OUTSIDE_I18N[lang];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo />
            <p style={{ marginTop: 14 }}>{t.footer_tagline}</p>
          </div>
          <div className="footer-col">
            <h4>{t.nav_games}</h4>
            {[...games]
              .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
              .map((g) => (
                <a key={g.id} href={g.url || "#"} target={g.url ? "_blank" : undefined} rel="noreferrer">{g.title}</a>
              ))}
          </div>
          <div className="footer-col">
            <h4>LINKS</h4>
            <a href={(window.OUTSIDE_CONFIG||{}).discordUrl||"#"} target="_blank" rel="noreferrer">Discord</a>
            <a href="https://www.roblox.com/communities/35928033" target="_blank" rel="noreferrer">Outside Hub — Roblox</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 OUTSIDE STUDIO — {t.footer_rights.toUpperCase()}</div>
          <div>BUILT WITH ♥ IN LUAU</div>
        </div>
      </div>
    </footer>
  );
};

const Carousel = ({ images, game, onClose }) => {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => setIdx(0), [game && game.id]);
  const imgs = images && images.filter(x => x).length > 0 ? images.filter(x => x) : null;
  if (!imgs) {
    return (
      <div className="modal-art">
        <PlaceholderArt game={game} large />
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    );
  }
  const prev = (e) => { e.stopPropagation(); setIdx((idx - 1 + imgs.length) % imgs.length); };
  const next = (e) => { e.stopPropagation(); setIdx((idx + 1) % imgs.length); };
  return (
    <div className="modal-carousel">
      <img key={idx} src={imgs[idx]} alt="" className="carousel-img" onError={(e) => { e.target.style.opacity = 0.15; }} />
      {imgs.length > 1 && (
        <>
          <button className="carousel-btn carousel-prev" onClick={prev}>‹</button>
          <button className="carousel-btn carousel-next" onClick={next}>›</button>
          <div className="carousel-dots">
            {imgs.map((_, i) => (
              <button key={i} className={`carousel-dot${i === idx ? " active" : ""}`} onClick={(e) => { e.stopPropagation(); setIdx(i); }} />
            ))}
          </div>
        </>
      )}
      <button className="modal-close" onClick={onClose}>✕</button>
    </div>
  );
};

const Modal = ({ game, lang, onClose, allNews, onOpenNews }) => {
  const t = window.OUTSIDE_I18N[lang];
  const statusMap = {
    live: t.games_status_live,
    soon: t.games_status_soon,
    classic: t.games_status_classic,
  };
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  const gameDevlogs = game ? (allNews || []).filter(n => n.gameId === game.id) : [];
  return (
    <div className={`modal-backdrop ${game ? "open" : ""}`} onClick={onClose}>
      {game && (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <Carousel images={game.images} game={game} onClose={onClose} />
          <div className="modal-body">
            <h3 className="modal-title">{game.title}</h3>
            <div className="modal-tag">{game.tag || "Roblox Experience"}</div>
            <p className="modal-desc">{lang === "pt" ? game.desc_pt : game.desc_en}</p>
            <div className="modal-specs">
              <div className="modal-spec">
                <div className="k">{t.modal_genre}</div>
                <div className="v">{genreLabel(game, lang)}</div>
              </div>
              <div className="modal-spec">
                <div className="k">{t.modal_status}</div>
                <div className="v">{statusMap[game.status]}</div>
              </div>
              <div className="modal-spec">
                <div className="k">{lang === "pt" ? "ANO" : "YEAR"}</div>
                <div className="v">{game.year}</div>
              </div>
              <div className="modal-spec">
                <div className="k">ENGINE</div>
                <div className="v"><EngineTag engine={game.engine} /></div>
              </div>
              <div className="modal-spec">
                <div className="k">{t.modal_platform}</div>
                <div className="v"><PlatformBadges platforms={game.platforms || []} /></div>
              </div>
            </div>
            <div className="modal-actions">
              {game.url && (
                <a className="btn btn-primary" href={game.url} target="_blank" rel="noreferrer">
                  {t.games_play} <span className="arrow">→</span>
                </a>
              )}
              {game.wiki && (
                <a className="btn btn-ghost" href={game.wiki} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5"/><path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5M1.5 8h13"/></svg>
                  Wiki <span className="arrow">→</span>
                </a>
              )}
            </div>
            {gameDevlogs.length > 0 && (
              <div className="modal-devlogs">
                <div className="modal-devlogs-title">// {t.modal_devlogs}</div>
                <div className="modal-devlogs-list">
                  {gameDevlogs.map(n => (
                    <div key={n.id} className="modal-devlog-item" onClick={(e) => { e.stopPropagation(); onOpenNews(n); }}>
                      <div className="modal-devlog-meta">
                        <span>{lang === "pt" ? n.date_pt : n.date_en}</span>
                        <span className="news-tag">{n.tag}</span>
                      </div>
                      <div className="modal-devlog-title">{lang === "pt" ? n.title_pt : n.title_en}</div>
                      <p className="modal-devlog-body">{lang === "pt" ? n.body_pt : n.body_en}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TweaksPanel = ({ open, tweaks, setTweak }) => {
  return (
    <div className={`tweaks-panel ${open ? "open" : ""}`}>
      <h3>TWEAKS<span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em" }}>v1.0</span></h3>
      <p>// CUSTOMIZE THE VIBE</p>

      <div className="tweak-row">
        <label>ACCENT HUE</label>
        <div className="tweak-swatches">
          {[
            { k: "emerald", c: "oklch(0.82 0.16 165)" },
            { k: "cyan", c: "oklch(0.82 0.14 220)" },
            { k: "purple", c: "oklch(0.72 0.2 300)" },
            { k: "orange", c: "oklch(0.78 0.16 55)" },
            { k: "pink", c: "oklch(0.75 0.2 0)" },
          ].map((s) => (
            <div
              key={s.k}
              className={`tweak-swatch ${tweaks.accent === s.k ? "active" : ""}`}
              style={{ background: s.c, color: s.c }}
              onClick={() => setTweak("accent", s.k)}
            />
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>HERO LAYOUT</label>
        <div className="tweak-options">
          {["default", "centered"].map((v) => (
            <button
              key={v}
              className={`tweak-opt ${tweaks.hero === v ? "active" : ""}`}
              onClick={() => setTweak("hero", v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>BACKGROUND</label>
        <div className="tweak-options">
          {["grid", "dots", "lines", "none"].map((v) => (
            <button
              key={v}
              className={`tweak-opt ${tweaks.bg === v ? "active" : ""}`}
              onClick={() => setTweak("bg", v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>CARD CORNERS</label>
        <div className="tweak-options">
          {["round", "sharp"].map((v) => (
            <button
              key={v}
              className={`tweak-opt ${tweaks.cards === v ? "active" : ""}`}
              onClick={() => setTweak("cards", v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

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
            <a className="btn btn-ghost rblx-cta"
              href="https://www.roblox.com/communities/35928033/Outside-Hub#!/about"
              target="_blank" rel="noreferrer" style={{ width: "fit-content" }}>
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
            <a className="btn btn-primary"
              href={(window.OUTSIDE_CONFIG||{}).discordUrl||"#"}
              target="_blank" rel="noreferrer"
              style={{ background: "oklch(0.72 0.2 300)", color: "#fff", boxShadow: "0 10px 40px -10px oklch(0.72 0.2 300 / 0.5)" }}>
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

// ----- App -----
const TWEAK_DEFAULTS = {
  accent: "emerald",
  hero: "default",
  bg: "grid",
  cards: "round"
};

const accentMap = {
  emerald: { a: "oklch(0.82 0.16 165)", a2: "oklch(0.82 0.14 220)", glow: "oklch(0.82 0.16 165 / 0.35)" },
  cyan: { a: "oklch(0.82 0.14 220)", a2: "oklch(0.82 0.16 165)", glow: "oklch(0.82 0.14 220 / 0.35)" },
  purple: { a: "oklch(0.72 0.2 300)", a2: "oklch(0.82 0.14 220)", glow: "oklch(0.72 0.2 300 / 0.35)" },
  orange: { a: "oklch(0.78 0.16 55)", a2: "oklch(0.82 0.14 220)", glow: "oklch(0.78 0.16 55 / 0.35)" },
  pink: { a: "oklch(0.75 0.2 0)", a2: "oklch(0.82 0.14 220)", glow: "oklch(0.75 0.2 0 / 0.35)" },
};

const App = () => {
  const [lang, setLangState] = useState(getLang());
  const [modalGame, setModalGame] = useState(null);
  const [modalNews, setModalNews] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState({ ...TWEAK_DEFAULTS });
  const [adminOpen, setAdminOpen] = useState(false);
  const [games, setGamesState] = useState(() => window.loadLS(window.LS_GAMES, window.OUTSIDE_GAMES.map(g => ({...g}))));
  const [devs, setDevsState] = useState(() => window.loadLS(window.LS_DEVS, window.DEFAULT_DEVS.map(d => ({...d}))));
  const [news, setNewsState] = useState(() => window.loadLS(window.LS_NEWS, window.OUTSIDE_NEWS.map(n => ({...n, id: n.id || Math.random().toString(36).slice(2,9)}))));
  const [robloxStats, setRobloxStats] = useState({});

  // Fetch player counts from stats.json (updated by GitHub Actions every ~15 min)
  useEffect(() => {
    fetch('./stats.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => setRobloxStats(d.games || {}))
      .catch(() => {});
  }, []);

  const setGames = (g) => { setGamesState(g); window.saveLS(window.LS_GAMES, g); };
  const setDevs = (d) => { setDevsState(d); window.saveLS(window.LS_DEVS, d); };
  const setNews = (n) => { setNewsState(n); window.saveLS(window.LS_NEWS, n); };

  const setLang = (l) => {
    setLangLS(l);
    setLangState(l);
    document.documentElement.lang = l === "pt" ? "pt-BR" : "en";
  };

  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
  };

  // apply tweaks
  useEffect(() => {
    document.body.dataset.hero = tweaks.hero;
    document.body.dataset.bg = tweaks.bg;
    document.body.dataset.cards = tweaks.cards;
    const a = accentMap[tweaks.accent] || accentMap.emerald;
    document.documentElement.style.setProperty("--accent", a.a);
    document.documentElement.style.setProperty("--accent-2", a.a2);
    document.documentElement.style.setProperty("--glow", a.glow);
  }, [tweaks]);

  // admin open: #admin hash or Ctrl+Shift+A (only when panel is available)
  useEffect(() => {
    if (!window.AdminPanel) return;
    const checkHash = () => { if (location.hash === "#admin") setAdminOpen(true); };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    const key = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault(); setAdminOpen(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("hashchange", checkHash); window.removeEventListener("keydown", key); };
  }, []);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("shown");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  return (
    <>
      <div className="grid-bg" />
      <div className="noise" />
      <Nav lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Games lang={lang} onOpen={setModalGame} games={games} robloxStats={robloxStats} />
        <UnrealTeaser lang={lang} />
        <Team lang={lang} members={devs} games={games} />
        <Goals lang={lang} />
        <News lang={lang} items={news} onOpen={setModalNews} games={games} />
        <Community lang={lang} />
        <RobloxCommunity lang={lang} />
      </main>
      <Footer lang={lang} games={games} />
      <Modal game={modalGame} lang={lang} onClose={() => setModalGame(null)} allNews={news} onOpenNews={setModalNews} />
      {modalNews && <NewsModal item={modalNews} lang={lang} onClose={() => setModalNews(null)} />}
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweak={setTweak} />
      {window.AdminPanel && <window.AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        games={games} setGames={setGames}
        devs={devs} setDevs={setDevs}
        news={news} setNews={setNews}
        lang={lang}
      />}
      {window.AdminPanel && <button className="admin-fab" title="Admin (Ctrl+Shift+A)" onClick={() => setAdminOpen(true)}>◆</button>}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
