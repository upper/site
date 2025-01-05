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
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
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
              upper/db aims to provide tools for handling the most common
              database operations while remaining unobtrusive in more advanced
              scenarios.
            </p>
            <p>
              If you’d rather not spend your time writing simple <tt>SELECT *
              FROM blah</tt> statements manually, and instead focus on the
              business logic of your application, but still be able to use SQL
              when needed, then upper/db is the library for you.
            </p>
          </div>
          <div style={{flex: 1}}>
            Illustration
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
      description="upper/db is a productive data access library for Go.">
      <HomepageHeader />
      <main>
        <HeroPhrase />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
