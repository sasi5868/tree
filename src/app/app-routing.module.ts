import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./auth/auth.guard";
import { TreeComponent } from './tree/tree.component';

const routes: Routes = [
  { path: "", redirectTo: 'auth', pathMatch: 'full'  },
  { path: "edit", component: TreeComponent, canActivate: [AuthGuard] },
  // { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  // { path: "auth", loadChildren: "../app/auth/auth.module#AuthModule"},
  { path: 'auth', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
