'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { SiteCopy, PricingResponse, FaqItem } from '@/lib/cms/types';
import type { BlogPostMeta } from '@/lib/cms/data';
import { BrandApplicationForm } from '@/components/forms';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/primitives';

type Locale = 'ja' | 'en';

export function HeroSection({ copy, locale }: { copy: SiteCopy; locale: Locale }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/10 p-8 shadow-lg sm:p-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
        <Badge className="bg-primary/20 text-primary">{copy.hero.eyebrow}</Badge>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{copy.hero.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{copy.hero.subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/${locale}/for-brands`}>{copy.hero.primaryCta}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href={`/${locale}/contact`}>{copy.hero.secondaryCta}</Link>
          </Button>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          {copy.hero.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-background/60 p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</dt>
              <dd className="mt-2 text-lg font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 hidden h-80 w-80 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4, duration: 1 }}
      />
    </section>
  );
}

export function ValueProps({ copy }: { copy: SiteCopy }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">{copy.valueProps.title}</h2>
        <p className="max-w-xl text-sm text-muted-foreground">{copy.whyNow.footnote}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {copy.valueProps.items.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function WhyNow({ copy }: { copy: SiteCopy }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-muted/30 p-8">
      <h2 className="text-2xl font-semibold">{copy.whyNow.title}</h2>
      <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        {copy.whyNow.items.map((item) => (
          <li key={item} className="rounded-2xl bg-background/90 p-4 shadow-sm">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{copy.whyNow.footnote}</p>
    </section>
  );
}

export function RoadmapTimeline({ copy }: { copy: SiteCopy }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">{copy.roadmap.title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {copy.roadmap.items.map((item) => (
          <Card key={item.period} className="border-primary/30">
            <CardHeader>
              <CardTitle>{item.period}</CardTitle>
              <CardDescription className="text-base text-foreground">{item.headline}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function PartnerMarquee({ copy }: { copy: SiteCopy }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-background/90 p-6">
      <h2 className="text-sm uppercase tracking-wide text-muted-foreground">Partner Pipeline</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 text-lg font-semibold text-muted-foreground sm:grid-cols-3 lg:grid-cols-6">
        {copy.partnerLogos.map((logo) => (
          <div key={logo} className="rounded-2xl bg-muted/60 p-4 text-center">
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductOverview({ copy }: { copy: SiteCopy }) {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{copy.product.hero.title}</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{copy.product.hero.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {copy.product.features.map((feature) => (
          <Card key={feature.name} className="h-full">
            <CardHeader>
              <CardTitle>{feature.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-3xl border border-primary/30 bg-primary/10 p-8">
        <h2 className="text-2xl font-semibold">{copy.product.architecture.title}</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          {copy.product.architecture.layers.map((layer) => (
            <li key={layer} className="rounded-2xl bg-background/90 p-4 shadow-sm">
              {layer}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BlogList({ posts, locale }: { posts: BlogPostMeta[]; locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <Card key={post.slug} className="h-full border-border/60">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{post.excerpt}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{new Date(post.date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')}</span>
              <span>{post.readingTime}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            <Link className="text-sm font-semibold text-primary" href={`/${locale}/blog/${post.slug}`}>
              {locale === 'ja' ? '続きを読む' : 'Read article'} →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ForBrandsSection({
  copy,
  pricing,
  faq,
  dictionary,
  locale
}: {
  copy: SiteCopy;
  pricing: PricingResponse;
  faq: FaqItem[];
  dictionary: Dictionary;
  locale: Locale;
}) {
  const [showTaxIncluded, setShowTaxIncluded] = useState(true);

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-semibold">{copy.forBrands.hero.title}</h1>
        <p className="max-w-3xl text-muted-foreground">{copy.forBrands.hero.description}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.forBrands.benefits.map((benefit) => (
            <Card key={benefit.title} className="h-full">
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  {benefit.title}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {copy.forBrands.caseStudies.map((item) => (
            <Card key={item.brand} className="border-primary/20">
              <CardHeader>
                <CardTitle>{item.brand}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.result}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,420px]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Pricing</h2>
          <div className="flex items-center gap-3 text-sm">
            <span className={showTaxIncluded ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
              {locale === 'ja' ? '税込' : 'Tax inc.'}
            </span>
            <Button variant="outline" size="sm" onClick={() => setShowTaxIncluded((prev) => !prev)}>
              {locale === 'ja' ? '税抜/税込 切替' : 'Toggle tax display'}
            </Button>
            <span className={!showTaxIncluded ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
              {locale === 'ja' ? '税抜' : 'Tax excl.'}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pricing.plans.map((plan) => (
              <Card key={plan.slug} className="flex h-full flex-col justify-between border-primary/20">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <p className="text-2xl font-semibold">
                    ¥{(showTaxIncluded ? plan.priceWithTax : plan.price).toLocaleString()}
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{pricing.taxNote}</p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-6">
          <h3 className="text-xl font-semibold">{dictionary.brandsForm.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{copy.forBrands.pricingSummary}</p>
          <div className="mt-4">
            <BrandApplicationForm dictionary={dictionary} locale={locale} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{copy.forBrands.faqHeadline}</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faq.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

export function MarketSection({ copy }: { copy: SiteCopy }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {copy.market.stats.map((stat) => (
          <Card key={stat.label} className="border-primary/20">
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
              <CardDescription>{stat.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-3xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">References</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {copy.market.footnotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PressKit({ copy }: { copy: SiteCopy }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Press Kit</h1>
        <p className="mt-2 text-muted-foreground">{copy.press.overview}</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {copy.press.assets.map((asset) => (
          <Card key={asset.name} className="border-primary/20">
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="space-y-2">
                <Link href={asset.file} className="inline-flex items-center text-primary underline-offset-4 hover:underline">
                  {asset.file}
                </Link>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TeamSection({ copy }: { copy: SiteCopy }) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Team</h1>
        <p className="mt-2 text-muted-foreground">{copy.team.intro}</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {copy.team.roles.map((role) => (
          <Card key={role.title}>
            <CardHeader>
              <CardTitle>{role.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{role.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="rounded-3xl border border-primary/20 bg-primary/10 p-8">
        <h2 className="text-2xl font-semibold">{copy.team.hiring.headline}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {copy.team.hiring.roles.map((role) => (
            <Card key={role.title} className="border-primary/20">
              <CardHeader>
                <CardTitle>{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{role.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export function VisionContent({ copy }: { copy: SiteCopy }) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{copy.vision.mission}</h1>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {copy.vision.challenges.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Differentiation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {copy.vision.differentiators.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Barriers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {copy.vision.barriers.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RoadmapDetail({ copy }: { copy: SiteCopy }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {copy.roadmapPage.milestones.map((milestone) => (
          <Card key={milestone.title} className="border-border/60">
            <CardHeader>
              <CardTitle>{milestone.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{milestone.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="rounded-3xl border border-primary/30 bg-primary/10 p-8">
        <h2 className="text-2xl font-semibold">{copy.roadmapPage.capital.title}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {copy.roadmapPage.capital.items.map((item) => (
            <div key={item.label} className="rounded-2xl bg-background/90 p-4 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}%</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}