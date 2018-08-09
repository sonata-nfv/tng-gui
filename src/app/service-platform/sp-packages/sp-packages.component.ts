import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ServicePlatformService } from "../service-platform.service";

@Component({
  selector: "app-sp-packages",
  templateUrl: "./sp-packages.component.html",
  styleUrls: ["./sp-packages.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpPackagesComponent implements OnInit {
  loading: boolean;
  packages = new Array();
  displayedColumns = ["type", "vendor", "name", "version", "createdAt"];

  constructor(
    private servicePlatformService: ServicePlatformService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.requestPackages();
  }

  searchFieldData(search) {
    this.requestPackages(search);
  }

  /**
   * Generates the HTTP request to get the list of packages.
   *
   * @param search [Optional] Package attributes that must be
   *                          matched by the returned list of
   *                          packages.
   */
  requestPackages(search?) {
    this.loading = true;

    this.servicePlatformService
      .getPackages(search)
      .then(response => {
        this.loading = false;
        this.packages = response;
      })
      .catch(err => {
        this.loading = false;
      });
  }

  openPackage(row) {
    let uuid = row.uuid;
    this.router.navigate(["detail/", uuid], { relativeTo: this.route });
  }
}
