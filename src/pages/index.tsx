import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Megatron Engineering"
      description="By Kamu Kamlesh — Experiments. Architecture. Engineering."
    >
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>👋 Welcome to Megatron Engineering</h1>
          <p>
            By Kamu Kamlesh — showcasing real-world PoCs, architecture, and dev
            notes.
          </p>
        </div>

        <div className={styles.tiles}>
          <Link className={styles.card} to="/docs/projects/ecom-system">
            <h3>📦 Projects</h3>
            <p>Explore microservices, APIs, event-driven POCs and more.</p>
          </Link>

          <Link
            className={styles.card}
            to="/docs/architecture/ecom-architecture"
          >
            <h3>📐 Architecture</h3>
            <p>View system diagrams, infra design, CI/CD pipelines etc.</p>
          </Link>

          <Link className={styles.card} to="/docs/notes/docker-tips">
            <h3>📝 Notes</h3>
            <p>Tips, fixes, and dev learnings across tools and stacks.</p>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
