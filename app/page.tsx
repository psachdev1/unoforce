import { SalesCoach } from "@/components/sales-coach";

export default function Home() {
  return (
    <main>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Unoforce home">
          uno<span>force</span>
        </a>
        <nav className="site-nav" aria-label="Product navigation">
          <a href="#import">Import</a>
          <a href="#integrations">Integrations</a>
          <a className="nav-primary" href="#coach">Get Started</a>
        </nav>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow">Your personal sales coach</p>
          <h1>Start every sales day with an edge.</h1>
          <p className="dek">
            Focus on selling. Unoforce keeps the priorities, context, and records in order—without
            the fuss.
          </p>
          <a className="primary-link" href="#coach">
            Get Started <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="promise" aria-label="What Unoforce helps with">
          <p className="promise-label">Three jobs, one conversation</p>
          <ol>
            <li><span>01</span> Surface the insights that can move today.</li>
            <li><span>02</span> Understand any relationship or opportunity.</li>
            <li><span>03</span> Record what happened in plain English.</li>
          </ol>
          <p className="promise-note">No pipeline to clean. No updates copied between tools.</p>
        </aside>
      </section>

      <section className="coach-section" id="coach" aria-labelledby="coach-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live product preview</p>
            <h2 id="coach-title">Just tell it what you need.</h2>
          </div>
          <p>
            Ask in plain English. This preview uses a fictional real-estate book of business,
            our first testing beachhead.
          </p>
        </div>
        <SalesCoach />
      </section>

      <section className="data-sources" id="data-sources" aria-labelledby="data-title">
        <div className="data-intro">
          <p className="eyebrow">Data sources · planned</p>
          <h2 id="data-title">Bring the history. Keep the habit.</h2>
          <p>
            Start with the customer context you already have. Import once or connect a source;
            continue working through one conversation.
          </p>
        </div>
        <div className="source-menus">
          <details id="import">
            <summary>
              <span>Import existing data</span>
              <strong>Coming soon · file-based setup</strong>
            </summary>
            <ul>
              <li><span>WhatsApp</span><small>Exported chat file</small></li>
              <li><span>CRM export</span><small>CSV from Salesforce, HubSpot, or Close</small></li>
              <li><span>Spreadsheet</span><small>CSV from Google Sheets or Excel</small></li>
            </ul>
          </details>
          <details id="integrations">
            <summary>
              <span>Connect an integration</span>
              <strong>Coming soon · ongoing sync</strong>
            </summary>
            <ul>
              <li><span>Salesforce</span><small>Contacts, companies, and opportunities</small></li>
              <li><span>HubSpot</span><small>Contacts, companies, and deals</small></li>
              <li><span>Close</span><small>Leads, contacts, and opportunities</small></li>
              <li><span>Google Sheets</span><small>Selected customer and activity sheets</small></li>
            </ul>
          </details>
        </div>
        <p className="planned-note">Preview only. Imports and integrations are not connected yet.</p>
      </section>

      <footer>
        <p>
          This preview uses fictional customer context and browser-only memory. CRM, messaging,
          dialer, and transcript connections are planned—not live.
        </p>
      </footer>
    </main>
  );
}
