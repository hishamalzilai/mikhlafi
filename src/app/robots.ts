import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/hq-management-system/', '/api/'], // نمنع جوجل من أرشفة لوحة التحكم
    },
    sitemap: 'https://abdulmalik-almekhlafi.com/sitemap.xml',
  }
}
