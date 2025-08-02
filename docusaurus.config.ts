import { Config } from "@docusaurus/types";

const config: Config = {
  title: "Megatron Engineering",
  tagline: "By Kamu Kamlesh — Experiments. Architecture. Engineering.",
  url: "https://your-megatron-site.com", // can be updated later
  baseUrl: "/",
  favicon: "img/favicon.ico",

  organizationName: "kamukamlesh", // GitHub org/user
  projectName: "megatron-dev-docs", // repo name

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // update navbar and footer below
  themeConfig: {
    navbar: {
      title: "Megatron",
      logo: {
        alt: "Megatron Logo",
        src: "img/megatron-logo.png", // add logo if you want
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
        { to: "/docs/notes/docker-tips", label: "Notes", position: "left" },
        {
          href: "https://github.com/kamukamlesh",
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
