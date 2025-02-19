import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import codeBlock from './plugins/codeblock';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'upper/db',
  tagline: 'A productive data access layer for Go',
  favicon: 'img/gopher.svg',

  markdown: {
    format: 'md',
  },

  // Set the production url of your site here
  url: 'https://upper.io', // Your website URL
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'upper.io',
  projectName: 'upper.io',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          remarkPlugins: [
            codeBlock,
          ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },

    // Replace with your project's social card
    //image: 'img/docusaurus-social-card.jpg',
    navbar: {
      hideOnScroll: true,
      title: 'upper/db',
      logo: {
        alt: 'upper/db',
        src: 'img/gopher.svg',
      },
      items: [
        {
          to: '/v4/getting-started',
          label: 'Getting Started',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Getting Started',
              to: '/v4/getting-started',
            },
            {
              label: 'API Reference',
              to: 'https://pkg.go.dev/github.com/upper/db/v4',
            },
          ],
        },
        {
          title: 'Code',
          items: [
            {
              label: 'File an issue',
              href: 'https://github.com/upper/db/issues',
            },
            {
              label: 'Source code',
              href: 'https://github.com/upper/db',
            },
          ],
        },
        {
          title: 'About',
          items: [
            {
              label: 'Authors',
              to: '/authors',
            },
            {
              label: 'License',
              to: '/license',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} upper/db`,
    },
    prism: {
      defaultLanguage: 'go',
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
