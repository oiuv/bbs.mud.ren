export default [
  {
    path: 'ai',
    name: 'ai',
    component: () => import('./Show'),
    meta: {
      requiresAuth: true
    }
  }
]
