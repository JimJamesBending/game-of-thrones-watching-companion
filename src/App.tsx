import {
  ArrowLeftRight,
  BookOpen,
  Castle,
  CircleHelp,
  GitBranch,
  Map,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'
import { EpisodeGraph } from './components/EpisodeGraph'
import { EpisodeMap } from './components/EpisodeMap'
import { HouseLegend } from './components/HouseLegend'
import { CharacterRoster } from './components/CharacterRoster'
import { episodeIndex, getEpisodeContent } from './data/episodes'
import { relationCopy } from './data/houses'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/episode/s01e01" replace />} />
      <Route path="/episode/:episodeId" element={<EpisodePage />} />
      <Route path="*" element={<Navigate to="/episode/s01e01" replace />} />
    </Routes>
  )
}

function EpisodePage() {
  const params = useParams()
  const navigate = useNavigate()
  const episode = getEpisodeContent(params.episodeId ?? 's01e01')
  const seasonEpisodes = episodeIndex.filter((item) => item.season === episode.season)
  const knownCount = episode.characters.length
  const placeCount = episode.locations.length
  const directCount = episode.relationships.length

  return (
    <main className="app-shell">
      <a className="skip-link" href="#relationship-graph">
        Skip to relationship graph
      </a>

      <aside className="episode-rail" aria-label="Episode navigation">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Shield size={24} />
          </span>
          <div>
            <p className="eyebrow">Spoiler-safe</p>
            <h1>Thrones Companion</h1>
          </div>
        </div>

        <label className="episode-select-label" htmlFor="episode-select">
          Episode
        </label>
        <select
          id="episode-select"
          className="episode-select"
          value={episode.id}
          onChange={(event) => navigate(`/episode/${event.target.value}`)}
        >
          {episodeIndex.map((item) => (
            <option key={item.id} value={item.id}>
              S{item.season}E{item.episode}: {item.title}
            </option>
          ))}
        </select>

        <div className="season-strip" aria-label={`Season ${episode.season} episodes`}>
          {seasonEpisodes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === episode.id ? 'season-chip active' : 'season-chip'}
              onClick={() => navigate(`/episode/${item.id}`)}
              aria-current={item.id === episode.id ? 'page' : undefined}
            >
              {item.episode}
            </button>
          ))}
        </div>

        <nav className="rail-links" aria-label="Page sections">
          <a href="#relationship-graph">
            <GitBranch size={17} />
            Graph
          </a>
          <a href="#places">
            <Map size={17} />
            Map
          </a>
          <a href="#roster">
            <Users size={17} />
            Names
          </a>
        </nav>

        <div className="spoiler-card">
          <CircleHelp size={18} />
          <p>{episode.spoilerBoundary}</p>
        </div>
      </aside>

      <section className="page-content">
        <header className="episode-header">
          <div className="header-copy">
            <p className="eyebrow">Season {episode.season} Episode {episode.episode}</p>
            <h2>{episode.title}</h2>
            <p>{episode.summary}</p>
          </div>

          <div className="stat-grid" aria-label="Episode companion stats">
            <Stat icon={<Users />} label="Known people" value={knownCount || 'Queued'} />
            <Stat icon={<ArrowLeftRight />} label="Links shown" value={directCount || 'Queued'} />
            <Stat icon={<Castle />} label="Places" value={placeCount || 'Queued'} />
          </div>
        </header>

        {episode.status === 'scaffold' ? (
          <section className="empty-state" aria-label="Curation status">
            <BookOpen size={22} />
            <div>
              <h3>Curation needed</h3>
              <p>
                This route exists and is ready for episode-safe data. Add characters, relationships,
                houses, and places in the typed data files using the docs in <code>docs/</code>.
              </p>
            </div>
          </section>
        ) : null}

        <section className="workbench" id="relationship-graph">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Interactive relationship graph</p>
              <h3>Who is connected to whom</h3>
            </div>
            <div className="search-hint">
              <Search size={16} />
              <span>Pan, zoom, fit view, then zoom in for details</span>
            </div>
          </div>

          <EpisodeGraph episode={episode} />
        </section>

        <div className="companion-grid">
          <section className="panel" id="places">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Map layer</p>
                <h3>Places this episode expects you to know</h3>
              </div>
            </div>
            <EpisodeMap episode={episode} />
          </section>

          <section className="panel">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Houses</p>
                <h3>Color key</h3>
              </div>
            </div>
            <HouseLegend houseIds={episode.houses} />
            <div className="relationship-key">
              {relationCopy.map((item) => (
                <div key={item.kind} className="relationship-key-row">
                  <span className={`line-sample line-${item.kind}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="panel" id="roster">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Name memory</p>
              <h3>Character cards</h3>
            </div>
          </div>
          <CharacterRoster episode={episode} />
        </section>
      </section>
    </main>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
}) {
  return (
    <div className="stat-card">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

export default App
