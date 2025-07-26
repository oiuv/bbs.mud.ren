export default [
  {
    path: '/ai',
    name: 'ai',
    component: () => import('./Show'),
    meta: {
      requiresAuth: true,
      container: false,
      navbar: true,
      footer: false
    }
  }
]
