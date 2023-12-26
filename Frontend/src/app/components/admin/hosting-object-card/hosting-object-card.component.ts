import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HostingObject } from 'src/app/models/HostingObject';
import { HostingObjectService } from 'src/app/services/hosting-object.service';

@Component({
  selector: 'app-hosting-object-card',
  templateUrl: './hosting-object-card.component.html',
  styleUrls: ['./hosting-object-card.component.css']
})
export class HostingObjectCardComponent implements OnInit {

  @Input() hostingObject: HostingObject | null = null;
  @Output() onClick: EventEmitter<HostingObject> = new EventEmitter<HostingObject>();

  constructor(private hoService:HostingObjectService) { }

  ngOnInit(): void {
    this.getSlike();
  }

  
  getSlike() {
    
    this.hoService.getSlikaObjekta(this.hostingObject?.id ?? 0).then(
      resp => {

        const str = "data:image/jpeg;base64, " + resp.data;
        let elId = "imageElement" + this.hostingObject?.id;
        var img = document.getElementById(elId);
        img?.setAttribute("src", str);
      }

    )
  }
  clicked() {
    if (this.hostingObject)
      this.onClick.emit(this.hostingObject);
  }
}
