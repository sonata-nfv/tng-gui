import { Component, OnInit, ViewEncapsulation, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ServicePlatformService } from "../service-platform.service";
import { CommonService } from "../../shared/services/common/common.service";

@Component({
  selector: "app-slices-instances-create",
  templateUrl: "./slices-instances-create.component.html",
  styleUrls: ["./slices-instances-create.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SlicesInstancesCreateComponent implements OnInit {
  loading: boolean;
  instantiationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SlicesInstancesCreateComponent>,
    private servicePlatformService: ServicePlatformService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.instantiationForm = new FormGroup({
      nsiName: new FormControl(null, Validators.required),
      nsiDescription: new FormControl(null, Validators.required)
    });
  }

  instantiate() {
    const instance = {
      nstId: this.data.nstId,
      name: this.instantiationForm.get("nsiName").value,
      description: this.instantiationForm.get("nsiDescription").value
    };

    this.servicePlatformService
      .postOneSliceInstance(instance)
      .then(response => {})
      .catch(err => {
        this.commonService.openSnackBar(err, "");
      });

    this.commonService.openSnackBar("Instantiating...", "");
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
