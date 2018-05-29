import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { DialogDataService } from "../shared/services/dialog/dialog.service";
import { CommonService } from "../shared/services/common/common.service";

@Component({
  selector: "app-placement-policy",
  templateUrl: "./placement-policy.component.html",
  styleUrls: ["./placement-policy.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PlacementPolicyComponent implements OnInit {
  loading: boolean;
  requested: boolean = false;
  placementPolicyForm: FormGroup;
  show: boolean = false;
  error: boolean;
  prioritise: boolean = false;

  // TODO GET placement policies from a service
  placementPolicies = ["None", "Load Balanced", "Prioritise", "Fill First"];
  datacenters = new Array();
  datacentersSelected = new Array();

  constructor(
    private commonService: CommonService,
    private dialogData: DialogDataService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.placementPolicyForm = new FormGroup({
      placementPolicy: new FormControl(),
      datacenter: new FormControl()
    });
    this.placementPolicyForm.valueChanges.subscribe(value =>
      this._onFormChanges(value)
    );
  }

  private _onFormChanges(values) {
    if (values.placementPolicy !== null) {
      this.show = true;
    } else {
      this.show = false;
    }
    if (values.placementPolicy === "Prioritise") {
      this.prioritise = true;
      if (!this.requested) {
        this.loading = true;
        setTimeout(() => {
          this.commonService
            .requestVims()
            .then(response => {
              this.loading = false;
              this.datacenters = response;
              this.requested = true;
            })
            .catch(err => {
              this.loading = false;
            });
        }, 1000);
      }
    } else {
      this.prioritise = false;
    }
  }

  save(placementPolicyForm: FormGroup) {
    if (
      this.datacentersSelected.length < 1 &&
      placementPolicyForm.controls.placementPolicy.value === "Prioritise"
    ) {
      let title = "oh oh...";
      let content =
        "Please, select at least one datacenter for this placement policy.";
      let action = "Accept";
      this.dialogData.openDialog(title, content, action, () => {});
    } else {
      // TODO Save request to catalog
      console.log("this  is save");
    }
  }

  cancel(placementPolicyForm: FormGroup) {
    placementPolicyForm.reset();
    this.datacentersSelected = new Array();
  }

  addMore(placementPolicyForm: FormGroup) {
    if (placementPolicyForm.controls.datacenter.value !== null) {
      this.error = false;
      this.datacentersSelected.push(
        placementPolicyForm.controls.datacenter.value
      );
      placementPolicyForm.get("datacenter").reset();
    } else {
      this.error = true;
    }
  }

  eraseEntry(item) {
    this.datacentersSelected = this.datacentersSelected.filter(x => x !== item);
  }
}