import { Config } from "@docusaurus/types";

const config: Config = {
  title: "Megatron Engineering",
  tagline: "By Kamu Kamlesh — Experiments. Architecture. Engineering.",
  favicon: "img/favicon.ico",

  url: "https://docs.captaink.in",
  baseUrl: "/",

  organizationName: "KamuKamlesh08", // GitHub user/org
  projectName: "megatron-dev-docs", // GitHub repo name

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
        src: "img/megatron-docs.png",
      },
      items: [
        {
          to: "/docs/projects/auth-system",
          label: "Projects",
          position: "left",
        },
        {
          to: "/docs/architecture/e-commerce",
          label: "Architecture",
          position: "left",
        },
        {
          to: "/docs/notes",
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
