import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Locale } from '@/lib/i18n/config';
import { getSiteCopy, getPricing, getFaq, getBlogPosts } from '@/lib/cms/data';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getPost } from '@/lib/mdx';
import { articleJsonLd } from '@/lib/seo/jsonld';
import {
  HeroSection,
  ValueProps,
  WhyNow,
  RoadmapTimeline,
  PartnerMarquee,
  ProductOverview,
  ForBrandsSection,
  MarketSection,
  PressKit,
  TeamSection,
  VisionContent,
  RoadmapDetail,
  BlogList
} from '@/components/sections';
import { ContactForm, NewsletterForm } from '@/components/forms';

interface Props {
  params: { locale: Locale; segments?: string[] };
}

export async function generateStaticParams({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const posts = await getBlogPosts(locale);
  const basePaths = [
    [],
    ['product'],
    ['for-brands'],
    ['market'],
    ['press'],
    ['team'],
    ['vision'],
    ['roadmap'],
    ['contact'],
    ['blog'],
    ['legal', 'privacy'],
    ['legal', 'terms']
  ];
  return [...basePaths, ...posts.map((post) => ['blog', post.slug])].map((segments) => ({ segments }));
}

export default async function LocalePage({ params }: Props) {
  const locale = params.locale;
  const segments = params.segments ?? [];
  const copy = await getSiteCopy(locale);

  if (segments.length === 0) {
    return (
      <>
        <HeroSection copy={copy} locale={locale} />
        <ValueProps copy={copy} />
        <WhyNow copy={copy} />
        <RoadmapTimeline copy={copy} />
        <PartnerMarquee copy={copy} />
      </>
    );
  }

  const [first, second] = segments;

  switch (first) {
    case 'product':
      return <ProductOverview copy={copy} />;
    case 'for-brands': {
      const [pricing, faq, dictionary] = await Promise.all([getPricing(locale), getFaq(locale), getDictionary(locale)]);
      return <ForBrandsSection copy={copy} pricing={pricing} faq={faq} dictionary={dictionary} locale={locale} />;
    }
    case 'market':
      return <MarketSection copy={copy} />;
    case 'press':
      return <PressKit copy={copy} />;
    case 'team':
      return <TeamSection copy={copy} />;
    case 'vision':
      return <VisionContent copy={copy} />;
    case 'roadmap':
      return <RoadmapDetail copy={copy} />;
    case 'contact': {
      const dictionary = await getDictionary(locale);
      return (
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{copy.contact.headline}</h1>
              <p className="mt-2 text-muted-foreground">{copy.contact.description}</p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-muted/30 p-6">
              <h2 className="text-lg font-semibold">{dictionary.newsletter.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{dictionary.newsletter.description}</p>
              <div className="mt-4">
                <NewsletterForm dictionary={dictionary} />
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-background/95 p-6 shadow-sm">
            <ContactForm dictionary={dictionary} locale={locale} />
          </div>
        </section>
      );
    }
    case 'blog': {
      if (!second) {
        const [posts, dictionary] = await Promise.all([getBlogPosts(locale), getDictionary(locale)]);
        return (
          <div className="space-y-10">
            <section className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm">
              <h1 className="text-3xl font-semibold">Blog</h1>
              <p className="mt-2 text-muted-foreground">{copy.hero.subtitle}</p>
            </section>
            <BlogList posts={posts} locale={locale} />
            <section className="rounded-3xl border border-primary/30 bg-primary/10 p-6">
              <h2 className="text-xl font-semibold">{dictionary.newsletter.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{dictionary.newsletter.description}</p>
              <div className="mt-4">
                <NewsletterForm dictionary={dictionary} />
              </div>
            </section>
          </div>
        );
      }
      const post = await getPost(second, locale);
      if (!post) {
        notFound();
      }
      return (
        <article className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
          <h1>{post.frontmatter.title as string}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(post.frontmatter.date as string).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')}
          </p>
          <div className="mt-8 space-y-6">{post.content}</div>
          <Script id="ld-article" type="application/ld+json">
            {JSON.stringify(
              articleJsonLd(locale, {
                title: post.frontmatter.title as string,
                date: post.frontmatter.date as string,
                slug: second,
                excerpt: post.frontmatter.excerpt as string
              })
            )}
          </Script>
          <footer className="mt-12 text-sm text-muted-foreground">{copy.hero.subtitle}</footer>
        </article>
      );
    }
    case 'legal': {
      const isJa = locale === 'ja';
      if (second === 'privacy') {
        return (
          <article className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
            <h1>{isJa ? 'プライバシーポリシー' : 'Privacy Policy'}</h1>
            <p>
              {isJa
                ? 'ECeta（以下、「当社」）は、サービス提供にあたり個人情報保護法その他関連法令を遵守し、利用目的の範囲内で適切に取り扱います。'
                : 'ECeta (“we”) complies with applicable privacy regulations and handles personal information appropriately within the stated purposes.'}
            </p>
            <h2>{isJa ? '1. 取得する情報' : '1. Information we collect'}</h2>
            <ul>
              <li>{isJa ? 'ブランド申込フォーム：会社名、担当者情報、連絡先など' : 'Brand application forms: company details, contact information.'}</li>
              <li>{isJa ? 'ニュースレター登録：メールアドレス' : 'Newsletter sign-ups: email address only.'}</li>
              <li>{isJa ? 'アクセス解析：匿名の利用履歴、端末情報' : 'Analytics: anonymous usage data and device information.'}</li>
            </ul>
            <h2>{isJa ? '2. 利用目的' : '2. Purposes of use'}</h2>
            <p>
              {isJa
                ? 'ユーザーサポート、サービス向上、法令順守のためにのみ利用します。第三者提供は、事前同意がある場合または法令に基づく場合に限ります。'
                : 'We use the information for support, product improvement, and legal compliance. We only share data with consent or when required by law.'}
            </p>
            <h2>{isJa ? '3. 安全管理' : '3. Security'}</h2>
            <p>
              {isJa
                ? 'データは暗号化されたストレージに保存し、アクセス権限を最小限に限定します。'
                : 'Data is stored in encrypted systems with least-privilege access controls.'}
            </p>
            <h2>{isJa ? '4. お問い合わせ' : '4. Contact'}</h2>
            <p>{isJa ? 'privacy@eceta.com までご連絡ください。' : 'Reach us at privacy@eceta.com for inquiries.'}</p>
            <hr />
            <p className="text-sm text-muted-foreground">{copy.footer.address}</p>
          </article>
        );
      }
      if (second === 'terms') {
        return (
          <article className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
            <h1>{isJa ? '利用規約' : 'Terms of Service'}</h1>
            <p>
              {isJa
                ? '本規約は、ECetaが提供するすべてのオンラインサービスの利用条件を定めるものです。ユーザーは本規約に同意の上でサービスを利用するものとします。'
                : 'These terms govern the use of ECeta services. By accessing our products you agree to the conditions below.'}
            </p>
            <h2>{isJa ? '1. アカウント' : '1. Accounts'}</h2>
            <p>
              {isJa
                ? 'ブランド管理者は正確な情報を提供し、第三者への共有を禁止します。'
                : 'Brand administrators must provide accurate information and keep credentials secure.'}
            </p>
            <h2>{isJa ? '2. コンテンツと権利' : '2. Content & rights'}</h2>
            <p>
              {isJa
                ? '当社は没入型空間の演出に必要なライセンスを取得し、ユーザー生成コンテンツの適正管理を行います。'
                : 'We obtain necessary licenses for immersive experiences and reserve moderation rights over user-generated content.'}
            </p>
            <h2>{isJa ? '3. 禁止事項' : '3. Prohibited activities'}</h2>
            <ul>
              <li>{isJa ? '法令または公序良俗に反する行為' : 'Activities that violate laws or public order.'}</li>
              <li>{isJa ? 'システムへの不正アクセスやリバースエンジニアリング' : 'Unauthorized access or reverse engineering.'}</li>
              <li>{isJa ? '差別・誹謗中傷などのコミュニティガイドライン違反' : 'Discriminatory or harassing behavior.'}</li>
            </ul>
            <h2>{isJa ? '4. 免責' : '4. Liability'}</h2>
            <p>
              {isJa
                ? '不可抗力によるサービス中断について当社は責任を負いませんが、速やかに復旧に努めます。'
                : 'We are not liable for outages caused by force majeure but will work to restore services promptly.'}
            </p>
            <p className="text-sm text-muted-foreground">{copy.footer.address}</p>
          </article>
        );
      }
      break;
    }
    default:
      break;
  }

  notFound();
}