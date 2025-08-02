import { Config } from "@docusaurus/types";

const config: Config = {
  title: "Megatron Engineering",
  tagline: "By Kamu Kamlesh — Experiments. Architecture. Engineering.",
  favicon: "img/favicon.ico",

  // ✅ Main GitHub Pages URL setup
  url: "https://KamuKamlesh08.github.io",
  baseUrl: "/megatron-dev-docs/",

  organizationName: "KamuKamlesh08", // GitHub user/org
  projectName: "megatron-dev-docs", // GitHub repo name

  // ✅ Highly recommended to fix trailingSlash warning
  trailingSlash: false,

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themeConfig: {
    navbar: {
      title: "Megatron",
      logo: {
        alt: "Megatron Logo",
        src: "img/megatron-logo.png",
      },
      items: [
        {
          to: "/docs/projects/ecom-system",
          label: "Projects",
          position: "left",
        },
        {
          to: "/docs/architecture/ecom-architecture",
          label: "Architecture",
          position: "left",
        },
        {
          to: "/docs/notes/docker-tips",
          label: "Notes",
          position: "left",
        },
        {
          href: "https://github.com/KamuKamlesh08",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `© ${new Date().getFullYear()} Kamu Kamlesh | Megatron Engineering`,
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};

export default config;
