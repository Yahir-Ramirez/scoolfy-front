import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Base64 } from '@digitalpersona/core';


import { FingerPrintService } from './services/finger-print.service';
import { AcquisitionStarted, DeviceConnected, DeviceDisconnected, FingerprintReader, SampleFormat, SamplesAcquired } from '@digitalpersona/devices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public reader: FingerprintReader;
  public infoFingerPrintReader: any;
  public image: any;
  public readFile: Object;
  public objEnvio: any = {};
  public huellas: Array<any> = [];


  constructor(private readonly fingerPrintService: FingerPrintService,
    private http: HttpClient) {

    this.reader = new FingerprintReader();
    this.readFile = new FileReader();

  }


  ngOnInit(): void {
    this.reader = new FingerprintReader();
    this.reader.on('DeviceConnected', this.onDeviceConnected);
    this.reader.on('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.on('AcquisitionStarted', this.onAcquisitionStarted);
    this.reader.on('SamplesAcquired', this.onSamplesAcquired)
  }


  private onDeviceConnected = (event: DeviceConnected) => {
    console.log('Hola estoy conectado', event);
  };

  private onDeviceDisconnected = (event: DeviceDisconnected) => {
    console.log('Estoy desconectado')
  };

  private onAcquisitionStarted = (event: AcquisitionStarted) => {

  };

  private onSamplesAcquired = (event: any) => {
    //console.log(`Huella capturada: ${event.samples[0]}`);
    if (this.huellas.length < 2) {
      this.huellas.push(Base64.fromBase64Url(event.samples[0]));
      this.image = this.parseimage(event.samples[0]);
    } else {
      alert('Ojo que ya estan las huellas, envie a verificar')
    }
  };


  public enrollFingerprint() {
    this.fingerPrintService.leerHuella().subscribe((huella: any) => {
      console.log(huella);
    })
  }


  public detener() {
    this.reader.stopAcquisition(this.infoFingerPrintReader)
      .then((response) => {
        console.log(response);
      })
  }

  public capturarHuellaPorfin() {
    this.reader.startAcquisition(SampleFormat.PngImage, this.infoFingerPrintReader)
      .then((response) => {
        console.log(response);
      })
  }

  public cuantosDispositivosConectados() {
    Promise.all([
      this.reader.enumerateDevices()
    ]).then((numero) => {
      console.log(numero);
      this.infoFingerPrintReader = numero[0][0]
    });
  }

  parseimage(image: any) {
    image = image.replace(/_/g, "/");
    image = image.replace(/-/g, "+");
    return image;
  }

  public sendImg() {
    this.objEnvio['primerHuella'] = this.huellas[0];
    this.objEnvio['segundaHuella'] = this.huellas[1];
    this.http.post(`https://lino.serveo.net/validateFinger`,this.objEnvio).subscribe((r: any) => {
      console.log(r);
      if(r){
        alert('Bienvenido al sistema. Estas autorizado')
      } else {
        alert('Falla al ingreso al sistema.No estas autorizado')

      }
    })
  }


}
