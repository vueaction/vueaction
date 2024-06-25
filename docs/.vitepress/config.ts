import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vueaction/docs/',
  title: 'VueAction',
  description: 'Marrying vue to you backend actions',
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
    ],

    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Multiple Drivers', link: '/multiple-drivers' },
      { text: 'useAction', link: '/use-action' },
      { text: 'runAction', link: '/run-action' },
      { text: 'Global Config', link: '/global-config' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vueaction/core' },
    ],
  },
})
