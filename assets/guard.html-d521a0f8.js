import{_ as n,o as s,c as a,a as e}from"./app-6a0382b2.js";const t={},p=e(`<h1 id="守卫" tabindex="-1"><a class="header-anchor" href="#守卫" aria-hidden="true">#</a> 守卫</h1><p>在接口开发我们中经常涉及到权限校验等情形。对传统 Koa 应用来说，通常只能通过配置前置中间件来复用校验逻辑。bwcx 提供了守卫，可以轻松实现一个用来拦截请求的中间件。</p><h2 id="自定义守卫" tabindex="-1"><a class="header-anchor" href="#自定义守卫" aria-hidden="true">#</a> 自定义守卫</h2><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Guard<span class="token punctuation">,</span> IBwcxGuard<span class="token punctuation">,</span> RequestContext <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-ljsm&#39;</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Guard</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">LoginGuard</span> <span class="token keyword">implements</span> <span class="token class-name">IBwcxGuard</span> <span class="token punctuation">{</span>
  <span class="token function">canPass</span><span class="token punctuation">(</span>ctx<span class="token operator">:</span> RequestContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 返回一个 boolean，\`true\` 为通过，\`false\` 则抛出 \`GuardNotPassException\` 异常</span>
    <span class="token comment">// 也可以抛出自定义异常</span>
    <span class="token keyword">return</span> <span class="token operator">!</span><span class="token operator">!</span>ctx<span class="token punctuation">.</span>login<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p><code>@Guard()</code> 默认作用域是 <code>DeferredTransient</code>。</p></div><h2 id="使用全局守卫" tabindex="-1"><a class="header-anchor" href="#使用全局守卫" aria-hidden="true">#</a> 使用全局守卫</h2><p>如果想把守卫为应用到全局，可以在 <code>app.ts</code> 中声明需要应用的守卫。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> LoginGuard <span class="token keyword">from</span> <span class="token string">&#39;./guards/login.guard&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">OurApp</span> <span class="token keyword">extends</span> <span class="token class-name">App</span> <span class="token punctuation">{</span>
  <span class="token keyword">protected</span> globalGuards <span class="token operator">=</span> <span class="token punctuation">[</span>LoginGuard<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line"> </div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="在控制器中使用守卫" tabindex="-1"><a class="header-anchor" href="#在控制器中使用守卫" aria-hidden="true">#</a> 在控制器中使用守卫</h2><p>如果想灵活地应用守卫，可以使用 <code>@UseGuards()</code> 装饰器，它可以装饰控制器或路由方法，接收一个或多个守卫类参数并按顺序加载它们。</p><p>同时，框架提供了 <code>@UseGuardsOr()</code> 装饰器，可以组合多个守卫，当其中有任意一个通过即通过。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-core&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Controller<span class="token punctuation">,</span> Get<span class="token punctuation">,</span> UseGuards <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-ljsm&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> LoginGuard <span class="token keyword">from</span> <span class="token string">&#39;../guards/login.guard&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> IsSelfGuard <span class="token keyword">from</span> <span class="token string">&#39;../guards/self.guard&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> AdminGuard <span class="token keyword">from</span> <span class="token string">&#39;../guards/admin.guard&#39;</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Controller</span></span><span class="token punctuation">(</span><span class="token string">&#39;/user&#39;</span><span class="token punctuation">)</span>
<span class="token decorator"><span class="token at operator">@</span><span class="token function">UseGuards</span></span><span class="token punctuation">(</span>LoginGuard<span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">UserController</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Get</span></span><span class="token punctuation">(</span><span class="token string">&#39;/get&#39;</span><span class="token punctuation">)</span>
  <span class="token comment">// 或只给指定路由方法应用守卫</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">UseGuards</span></span><span class="token punctuation">(</span>LoginGuard<span class="token punctuation">)</span>
  <span class="token comment">// 也可以应用或条件组合的守卫</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">UseGuardsOr</span></span><span class="token punctuation">(</span>IsSelfGuard<span class="token punctuation">,</span> AdminGuard<span class="token punctuation">)</span>
  <span class="token keyword">async</span> <span class="token function">getUsers</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span> rows<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><div class="highlight-line"> </div><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="守卫组" tabindex="-1"><a class="header-anchor" href="#守卫组" aria-hidden="true">#</a> 守卫组</h2><p>有时我们可能更习惯把多个封装好的守卫以装饰器形式罗列起来按顺序校验，并可能在多个校验之间穿插一些其他装饰器。bwcx 提供了 <code>createGuardGroup</code> 方法，可以创建一个 <code>&lt;string | symbol, IBwcxGuard&gt;</code> 的守卫组对象，方便快速取出单个守卫。</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createGuardGroup <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx/guard&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> LoginGuard <span class="token keyword">from</span> <span class="token string">&#39;./login.guard&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> IsSelfGuard <span class="token keyword">from</span> <span class="token string">&#39;./self.guard&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> AdminGuard <span class="token keyword">from</span> <span class="token string">&#39;./admin.guard&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> Guards <span class="token operator">=</span> <span class="token function">createGuardGroup</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  Login<span class="token operator">:</span> LoginGuard<span class="token punctuation">,</span>
  IsSelf<span class="token operator">:</span> IsSelfGuard<span class="token punctuation">,</span>
  Admin<span class="token operator">:</span> AdminGuard<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Guards<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在控制器中随意使用：</p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-core&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Controller<span class="token punctuation">,</span> Get <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;bwcx-ljsm&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Guards <span class="token keyword">from</span> <span class="token string">&#39;../guards&#39;</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Controller</span></span><span class="token punctuation">(</span><span class="token string">&#39;/user&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">UserController</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Get</span></span><span class="token punctuation">(</span><span class="token string">&#39;/get&#39;</span><span class="token punctuation">)</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Guards</span></span><span class="token punctuation">.</span><span class="token function">Login</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Guards</span></span><span class="token punctuation">.</span><span class="token function">IsSelf</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">async</span> <span class="token function">getUsers</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span> rows<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><div class="highlight-line"> </div><div class="highlight-line"> </div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),o=[p];function c(i,l){return s(),a("div",null,o)}const u=n(t,[["render",c],["__file","guard.html.vue"]]);export{u as default};
