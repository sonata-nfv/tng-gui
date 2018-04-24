import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import { AuthService } from "../shared/services/auth/auth.service";
import { Router } from "@angular/router";

import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  menu: String;
  section: String;
  subsection: String;
  username: String;
  email: String;
  @ViewChild("sidenav") sideNav: MatSidenav;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.menu = "dashboard";
    // TODO get email from user data request
    this.email = "example@gmail.com";
  }

  setMenu(e, buttonId) {
    if (buttonId === "dashboard" || buttonId === "users") {
      this.sideNav.close();
    } else {
      this.sideNav.open();
    }

    if (buttonId === "dashboard") {
      this.router.navigate(["/dashboard"]);
    } else if (buttonId === "users") {
      this.router.navigate(["/users"]);
    } else if (buttonId === "v&v") {
      this.router.navigate(["/validation"]);
    } else if (buttonId === "sp") {
      this.section = "policies";
      this.router.navigate(["/servicePlatform"]);
    } else if (buttonId === "sm") {
      this.section = "availableNS";
      this.router.navigate(["/availableNetworkServices"]);
    }
    this.menu = buttonId;
  }

  setSection(e, buttonId) {
    if (buttonId === "sla") {
      this.subsection = "slaAgreements";
    } else if (buttonId === "availableNS") {
      this.router.navigate(["/availableNetworkServices"]);
    } else if (buttonId === "requests") {
      this.router.navigate(["/requests"]);
    } else if (buttonId === "nsInstances") {
      this.router.navigate(["/instances"]);
    } else if (buttonId === "store") {
      this.subsection = "licences";
      this.router.navigate(["/licences"]);
    }

    this.section = buttonId;
  }

  setSubsection(e, buttonId) {
    if (buttonId === "serviceLicences") {
      this.router.navigate(["/serviceLicences"]);
    } else if (buttonId === "userLicences") {
      this.router.navigate(["/userLicences"]);
    }
    this.subsection = buttonId;
  }

  logout() {
    this.router.navigate(["/login"]);
    this.authService
      .logout()
      .then()
      .catch(err => {
        console.log(err);
      });
  }
}
