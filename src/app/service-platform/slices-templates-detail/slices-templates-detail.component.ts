import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

import { SlicesInstancesCreateComponent } from "../slices-instances-create/slices-instances-create.component";

@Component({
  selector: "app-slices-templates-detail",
  templateUrl: "./slices-templates-detail.component.html",
  styleUrls: ["./slices-templates-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesTemplatesDetailComponent implements OnInit {
  loading: boolean;
  detail = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService,
    private instantiateDialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.requestSlicesTemplate(params["id"]);
    });
  }

  /**
   * Generates the HTTP request of a Slices Template by UUID.
   *
   * @param uuid ID of the selected template to be displayed.
   *             Comming from the route.
   */
  requestSlicesTemplate(uuid) {
    this.loading = true;

    this.servicePlatformService
      .getOneSliceTemplate(uuid)
      .then(response => {
        this.loading = false;
        this.detail = response;
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
      });
  }

  instantiate() {
    this.instantiateDialog.open(SlicesInstancesCreateComponent, {
      data: {
        nstId: this.detail["uuid"],
        vendor: this.detail["vendor"],
        name: this.detail["name"],
        version: this.detail["version"]
      }
    });
  }

  deleteTemplate() {
    this.loading = true;
    this.servicePlatformService
      .deleteOneSlicesTemplate(this.detail["uuid"])
      .then(response => {
        this.commonService.openSnackBar("Template deleted", "");
        this.close();
      })
      .catch(err => {
        this.loading = false;
        this.commonService.openSnackBar(err, "");
        this.close();
      });
  }

  close() {
    this.router.navigate(["service-platform/slices/slices-templates"]);
  }
}
