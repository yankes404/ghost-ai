export interface MockProject {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: '1', name: 'Ghost AI Platform', slug: 'ghost-ai-platform', isOwned: true },
  { id: '2', name: 'Auth Service', slug: 'auth-service', isOwned: true },
  { id: '3', name: 'Partner API', slug: 'partner-api', isOwned: false },
]
