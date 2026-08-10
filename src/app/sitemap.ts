import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abdulmalik-almekhlafi.com'
  
  // قائمة الصفحات العامة في الموقع
  const routes = [
    '',
    '/archive',
    '/archive-cooperation',
    '/articles',
    '/bio',
    '/contact',
    '/library',
    '/news',
    '/testimonials',
    '/vision'
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
