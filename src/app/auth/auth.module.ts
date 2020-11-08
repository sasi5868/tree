import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule {}
