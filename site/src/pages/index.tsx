import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          upper<span className={styles.heroTitleHighlight}>/db</span>
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--outline button--primary button--lg', styles.getStarted)}
            to="https://tour.upper.io">
            Take the tour
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroPhrase() {
  return (
    <div className={clsx(styles.heroPhrase)}>
      <div className="container">
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{flex: 1, marginRight: '1rem'}}>
            <Heading as="h2" className="text--center">
              Built for productivity
            </Heading>
            <p>
              `upper/db` is the perfect library for developers who want to
              focus on the business logic of their applications without getting
              slowed down by writing simple <tt>SELECT * FROM table</tt> statements
              manually. It provides the convenience of an ORM while
              allowing you to use SQL whenever needed.
            </p>
            <p>
              `upper/db` aims to provide tools for handling the most common
              database operations while remaining unobtrusive in more advanced
              scenarios.
            </p>
          </div>
          <div style={{flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <img src="/img/square.png" alt="upper/db" width="50%" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="upper/db is a productive data access layer for Go.">
      <HomepageHeader />
      <main>
        <HeroPhrase />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
