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
          <p className="eyebrow">A sales coach for a team of one</p>
          <h1>Know which lead needs you next.</h1>
          <p className="dek">
            Unoforce remembers the context, suggests the next move, and records your updates
            through one simple conversation.
          </p>
          <a className="primary-link" href="#coach">
            Open my daily brief <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="promise" aria-label="What Unoforce helps with">
          <p className="promise-label">Your working rhythm</p>
          <ol>
            <li><span>01</span> Ask who needs attention today.</li>
            <li><span>02</span> Prepare the next message or call.</li>
            <li><span>03</span> Drop an update in normal words.</li>
          </ol>
          <p className="promise-note">No pipeline to clean. No fields to maintain.</p>
        </aside>
      </section>

      <section className="coach-section" id="coach" aria-labelledby="coach-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Live product preview</p>
            <h2 id="coach-title">Start with today.</h2>
          </div>
          <p>One fictional book of business. Your updates stay in this browser for this preview.</p>
        </div>
        <SalesCoach />
      </section>

      <footer>
        <p>
          This Build Week preview uses fictional customer context. It is not yet connected to
          WhatsApp or a CRM.
        </p>
      </footer>
    </main>
  );
}
