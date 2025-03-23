// import { Routes } from '@angular/router';
// import { TabsPage } from './tabs.page';

// export const routes: Routes = [
//   {
//     path: 'tabs',
//     component: TabsPage,
//     children: [
//       {
//         path: 'dashboard',
//         loadComponent: () =>
//           import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
//       },
//       {
//         path: 'expenses',
//         loadComponent: () =>
//           import('../expenses/expenses.page').then((m) => m.ExpensesPage),
//       },
//       // {
//       //   path: 'income',
//       //   loadComponent: () =>
//       //     import('../income/income.page').then((m) => m.IncomePage),
//       // },
//       // {
//       //   path: 'goals',
//       //   loadComponent: () =>
//       //     import('../goals/goals.page').then((m) => m.GoalsPage),
//       // },
//       // {
//       //   path: 'stats',
//       //   loadComponent: () =>
//       //     import('../stats/stats.page').then((m) => m.StatsPage),
//       // },
//       {
//         path: '',
//         redirectTo: '/tabs/dashboard',
//         pathMatch: 'full',
//       },
//     ],
//   },
//   {
//     path: '',
//     redirectTo: '/tabs/dashboard',
//     pathMatch: 'full',
//   },
// ];

// tabs.routes.ts
import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
