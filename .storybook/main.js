module.exports = {
  stories: [
    "../packages/**/stories/*.stories.mdx",
    "../packages/**/stories/*.stories.@(tsx|mdx|ts)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
};
