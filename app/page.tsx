import { SalesCoach } from "@/components/sales-coach";

export default function Home() {
  return (
    <main>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Unoforce home">
          uno<span>force</span>
        </a>
        <span className="build-label">Build Week preview</span>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow">Your personal sales coach</p>
          <h1>Less admin. More selling.</h1>
          <p className="dek">
            Plan your day. Prepare every conversation. Log outcomes in plain English. Unoforce
            handles the admin, so you can sell.
          </p>
          <a className="primary-link" href="#coach">
            Plan my sales day <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="promise" aria-label="What Unoforce helps with">
          <p className="promise-label">Three jobs, one conversation</p>
          <ol>
            <li><span>01</span> Plan and prioritize my sales day.</li>
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

      <footer>
        <p>
          This preview uses fictional customer context and browser-only memory. CRM, messaging,
          dialer, and transcript connections are planned—not live.
        </p>
      </footer>
    </main>
  );
}
