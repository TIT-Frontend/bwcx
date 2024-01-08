import{_ as p,r as e,o,c,b as s,d as n,e as i,a}from"./app-6a0382b2.js";const l={},u=a(`<h1 id="插件" tabindex="-1"><a class="header-anchor" href="#插件" aria-hidden="true">#</a> 插件</h1><h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>bwcx 支持通过插件扩展框架功能，可以通过引入插件来增强框架功能。</p><p>通常使用插件非常简单，只需要使用 <code>usePlugin()</code>，传入插件和需要的配置类即可。框架会自动根据环境注入对应的配置类对象到插件中。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> BwcxOrm <span class="token keyword">from</span> <span class="token string">&#39;bwcx-orm&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> DbConfig <span class="token keyword">from</span> <span class="token string">&#39;./configs/db/db.config&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">OurApp</span> <span class="token keyword">extends</span> <span class="token class-name">App</span> <span class="token punctuation">{</span>
  <span class="token keyword">protected</span> plugins <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">usePlugin</span><span class="token punctuation">(</span>BwcxOrm<span class="token punctuation">,</span> DbConfig<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开发插件" tabindex="-1"><a class="header-anchor" href="#开发插件" aria-hidden="true">#</a> 开发插件</h2><p>要开发插件也十分简单，框架提供了多个应用生命周期和请求扩展点。只需要实现自己的插件类即可。如果需要使用容器能力，框架也提供了容器方法，可以供开发者自行操作容器。</p><p>这里我们假定你开发一个独立的插件包，只需初始化一个项目并安装 <code>bwcx-ljsm</code> 作为 <code>devDependencies</code> 和 <code>peerDependencies</code> 即可。</p>`,8),r=s("code",null,"TypeORM",-1),k={href:"https://github.com/inversify/InversifyJS",target:"_blank",rel:"noopener noreferrer"},d=a(`<h3 id="定义插件类" tabindex="-1"><a class="header-anchor" href="#定义插件类" aria-hidden="true">#</a> 定义插件类</h3><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/container-key.ts</span>

<span class="token keyword">const</span> <span class="token constant">CONTAINER_KEY</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  Connection<span class="token operator">:</span> Symbol<span class="token punctuation">.</span><span class="token function">for</span><span class="token punctuation">(</span><span class="token string">&#39;plugin:ORM:Connection&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token constant">CONTAINER_KEY</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/metadata-key.ts</span>

<span class="token keyword">const</span> <span class="token constant">METADATA_KEY</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  EntityModel<span class="token operator">:</span> Symbol<span class="token punctuation">.</span><span class="token function">for</span><span class="token punctuation">(</span><span class="token string">&#39;plugin:orm:EntityModel&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token constant">METADATA_KEY</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/index.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> Container<span class="token punctuation">,</span> InjectContainer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-core&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> IBwcxPlugin<span class="token punctuation">,</span> Plugin<span class="token punctuation">,</span> RequestContext<span class="token punctuation">,</span> MiddlewareNext <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-ljsm&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token constant">CONTAINER_KEY</span> <span class="token keyword">from</span> <span class="token string">&#39;./container-key&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ConnectionOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;typeorm&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">OrmConfig</span> <span class="token operator">=</span> ConnectionOptions<span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Plugin</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">OrmPlugin</span> <span class="token keyword">implements</span> <span class="token class-name">IBwcxPlugin</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">InjectContainer</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  container<span class="token operator">:</span> Container<span class="token punctuation">;</span>

  <span class="token comment">// 插件激活时。这个过程发生在 App.wire 中，将在装配的最初阶段执行每个插件的 \`onActivate\`</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">onActivate</span><span class="token punctuation">(</span>config<span class="token operator">:</span> OrmConfig<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;orm plugin activate&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> connection <span class="token operator">=</span> <span class="token punctuation">{</span>
      fake<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      name<span class="token operator">:</span> <span class="token string">&#39;default&#39;</span><span class="token punctuation">,</span>
      <span class="token function">getRepository</span><span class="token punctuation">(</span>entity<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;get repository:&#39;</span><span class="token punctuation">,</span> entity<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token comment">// 将数据库连接对象存放到容器</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">container</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token constant">CONTAINER_KEY</span><span class="token punctuation">.</span>Connection<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toConstantValue</span><span class="token punctuation">(</span>connection<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 提供中间件。插件中间件将在用户指定的全局中间件之前挂载</span>
  <span class="token keyword">public</span> <span class="token function">getMiddleware</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">async</span> <span class="token punctuation">(</span>ctx<span class="token operator">:</span> RequestContext<span class="token punctuation">,</span> next<span class="token operator">:</span> MiddlewareNext<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;orm plugin middleware in&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;orm plugin middleware out&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 应用启动前。插件对生命周期的扩展将在用户扩展之前执行</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">beforeStart</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 应用退出前</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">beforeExit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>插件会在框架装配时激活，在激活时执行插件的 <code>onActivate</code> 方法。同时，如果框架需要注册中间件或扩展应用生命周期，都可以提供相应方法。</p><h2 id="提供自定义装饰器" tabindex="-1"><a class="header-anchor" href="#提供自定义装饰器" aria-hidden="true">#</a> 提供自定义装饰器</h2><p>插件可能需要提供装饰器。以我们的 ORM 插件为例，为了实现用户可以注入实体对应的 Repository，需要对外提供包装实体的 <code>@EntityModel()</code> 和供用户注入的 <code>@InjectRepository()</code>。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/decorators.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> Newable <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-common&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token constant">CONTAINER_KEY</span> <span class="token keyword">from</span> <span class="token string">&#39;./container-key&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Entity<span class="token punctuation">,</span> EntityOptions <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;typeorm&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> inject<span class="token punctuation">,</span> tagged <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;inversify&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> OrmPlugin <span class="token keyword">from</span> <span class="token string">&#39;.&#39;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 包装实体装饰器。会取得实体的 Repository 绑定到容器
 * <span class="token keyword">@decorator</span> <span class="token punctuation">{</span>class<span class="token punctuation">}</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">EntityModel</span><span class="token punctuation">(</span>entityOpts<span class="token operator">?</span><span class="token operator">:</span> EntityOptions<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 应用 TypeORM @Entity()</span>
    <span class="token function">Entity</span><span class="token punctuation">(</span>entityOpts<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 在数据库连接创建后才能把对应 Repository 绑定到容器</span>
    <span class="token comment">// 把所有 Entity 都附加到插件本身的元数据上，以便插件激活并建立数据库连接后，可以对所有 Entity 做处理</span>
    <span class="token keyword">const</span> lastEntityModels <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">getMetadata</span><span class="token punctuation">(</span><span class="token constant">METADATA_KEY</span><span class="token punctuation">.</span>EntityModel<span class="token punctuation">,</span> OrmPlugin<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> entityModels <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token operator">...</span>lastEntityModels<span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        target<span class="token punctuation">,</span>
        options<span class="token operator">:</span> entityOpts<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
    Reflect<span class="token punctuation">.</span><span class="token function">defineMetadata</span><span class="token punctuation">(</span><span class="token constant">METADATA_KEY</span><span class="token punctuation">.</span>EntityModel<span class="token punctuation">,</span> entityModels<span class="token punctuation">,</span> OrmPlugin<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 注入指定实体的 Repository
 * <span class="token keyword">@decorator</span> <span class="token punctuation">{</span>property<span class="token punctuation">}</span>
 * <span class="token keyword">@param</span> <span class="token parameter">entity</span>
 * <span class="token keyword">@param</span> <span class="token parameter">connectionName</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">InjectRepository</span><span class="token punctuation">(</span>entity<span class="token operator">:</span> Newable<span class="token punctuation">,</span> connectionName <span class="token operator">=</span> <span class="token string">&#39;default&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> identifier <span class="token operator">=</span> entity<span class="token punctuation">;</span>
    <span class="token function">inject</span><span class="token punctuation">(</span>identifier<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">tagged</span><span class="token punctuation">(</span><span class="token string">&#39;plugin:orm:ConnectionName&#39;</span><span class="token punctuation">,</span> connectionName<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在插件 <code>onActivate</code> 中处理 <code>@EntityModel()</code> 逻辑：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token comment">// src/index.ts</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Plugin</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">OrmPlugin</span> <span class="token keyword">implements</span> <span class="token class-name">IBwcxPlugin</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">InjectContainer</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  container<span class="token operator">:</span> Container<span class="token punctuation">;</span>

  <span class="token comment">// 插件激活时。这个过程发生在 App.wire 中，将在装配的最初阶段执行每个插件的 \`onActivate\`</span>
  <span class="token keyword">public</span> <span class="token keyword">async</span> <span class="token function">onActivate</span><span class="token punctuation">(</span>config<span class="token operator">:</span> OrmConfig<span class="token punctuation">,</span> app<span class="token operator">:</span> ApplicationInstance<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 建立连接...</span>
    <span class="token comment">// 处理 @EntityModel() 逻辑</span>
    <span class="token keyword">const</span> entityModels <span class="token operator">=</span> Reflect<span class="token punctuation">.</span><span class="token function">getMetadata</span><span class="token punctuation">(</span><span class="token constant">METADATA_KEY</span><span class="token punctuation">.</span>EntityModel<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>constructor<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> entity <span class="token keyword">of</span> entityModels<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> target<span class="token punctuation">,</span> options <span class="token punctuation">}</span> <span class="token operator">=</span> entity<span class="token punctuation">;</span>
      <span class="token keyword">const</span> identifier <span class="token operator">=</span> target<span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">container</span>
        <span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>identifier<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">toConstantValue</span><span class="token punctuation">(</span>connection<span class="token punctuation">.</span><span class="token function">getRepository</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">whenTargetTagged</span><span class="token punctuation">(</span><span class="token string">&#39;plugin:orm:ConnectionName&#39;</span><span class="token punctuation">,</span> connection<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10);function v(m,b){const t=e("ExternalLinkIcon");return o(),c("div",null,[u,s("p",null,[n("下面，我们将以如何开发一个简单的基于 "),r,n(" 的 ORM 插件为例介绍。其中可能包含部分直接操作容器的 API，可以参考 "),s("a",k,[n("InversifyJS"),i(t)]),n("。")]),d])}const g=p(l,[["render",v],["__file","plugin.html.vue"]]);export{g as default};
