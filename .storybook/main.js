module.exports = {
  // "stories": [
    // "../packages/**/stories/*.stories.mdx",
    // "../packages/**/stories/*.stories.@(jsx|mdx|js)"
  // ],
  "stories": [
    "../packages/button/stories/Button.stories.jsx",
    "../packages/header/stories/Header.stories.jsx",
    "../packages/page/stories/Page.stories.jsx"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  webpackFinal: async (config) => {
    console.log(config)
    // config.resolve.mainFields = ['browser']

    return config;
},
  "framework": "@storybook/react"
}