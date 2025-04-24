import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SignInComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'bookmarks',
    loadComponent: () => import('./components/bookmarks/bookmarks.component').then(m => m.BookmarksComponent)
  }
  ,
  {
    path: 'search',
    loadComponent: () =>
      import('./components/search/search.component').then((m) => m.SearchComponent),
  }
];
