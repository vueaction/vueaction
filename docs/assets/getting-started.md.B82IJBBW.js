import{_ as a,c as s,o as i,a1 as t}from"./chunks/framework.Cn6QQs8Y.js";const g=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"getting-started.md","filePath":"getting-started.md"}'),e={name:"getting-started.md"},n=t('<h1 id="getting-started" tabindex="-1">Getting Started <a class="header-anchor" href="#getting-started" aria-label="Permalink to &quot;Getting Started&quot;">​</a></h1><p>VueAction helps you <strong>standardize</strong>, and add types to your apps actions. You can usually think of an <strong>action</strong> as &quot;a function that hits an api&quot;, though VueAction does have a wider scope than just backend APIs.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>VueAction shines in typescript projects</p></div><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-label="Permalink to &quot;Installation&quot;">​</a></h2><p>VueAction requires two parts:</p><ul><li>core</li><li>and implementations</li></ul><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-oMeon" id="tab-W0n2JRc" checked><label for="tab-W0n2JRc">npm</label><input type="radio" name="group-oMeon" id="tab-4m7emM3"><label for="tab-4m7emM3">pnpm</label><input type="radio" name="group-oMeon" id="tab-k9LETNa"><label for="tab-k9LETNa">yarn</label><input type="radio" name="group-oMeon" id="tab-IMgskXM"><label for="tab-IMgskXM">bun</label></div><div class="blocks"><div class="language-sh vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/core</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/laravel</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/core</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/laravel</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/core</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/laravel</span></span></code></pre></div><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bun</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/core</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vueaction/laravel</span></span></code></pre></div></div></div><h2 id="setup" tabindex="-1">Setup <a class="header-anchor" href="#setup" aria-label="Permalink to &quot;Setup&quot;">​</a></h2><p>VueAction is a Vue plugin. here&#39;s how we get everything up and running!</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-q-1hV" id="tab-1O4uhDJ" checked><label for="tab-1O4uhDJ">main.ts</label><input type="radio" name="group-q-1hV" id="tab-XtYR-Z5"><label for="tab-XtYR-Z5">vue-model.ts</label></div><div class="blocks"><div class="language-ts vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">npm add @vueaction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">core @vueaction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">laravel</span></span></code></pre></div><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">pnpm add @vueaction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">core @vueaction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">laravel</span></span></code></pre></div></div></div>',10),l=[n];function p(o,h,d,r,c,k){return i(),s("div",null,l)}const v=a(e,[["render",p]]);export{g as __pageData,v as default};
