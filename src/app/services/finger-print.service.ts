import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Base64 } from '@digitalpersona/core';

import {
  FingerprintReader,
  SampleFormat,
} from '@digitalpersona/devices';

import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FingerPrintService {
  samples: any[] = [];
  huella: any;
  reader: FingerprintReader = new FingerprintReader();
  sampleObservable = new Subject<any>();
  samplesObservable = new Subject<any>();


  constructor() { }

  private onDeviceConnected = (event: any) => {
    console.log(event);
  };
  private onDeviceDisconnected = (event: any) => { };
  private onReaderError = (event: any) => { };
  private onAcquisitionStarted = (event: any) => { };
  private onSampleAcquired = (event: any) => {
    Swal.fire({
      title: 'completado',
      text: 'Se ha capturado la huella',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
    this.sampleObservable.next(Base64.fromBase64Url(event.samples[0]));
    return (this.huella = Base64.fromBase64Url(event.samples[0]));
  };

  private onSampleAcquiredMultiple = async (event: any) => {
    console.log("Huellas capturadas");
    await Swal.fire({
      title: `Huella ${this.samples.length + 1} capturada`,
      text: "Presione aceptar para continuar",
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
    this.samples.push(Base64.fromBase64Url(event.samples[0]));
    if (this.samples.length === 3) {
      this.samplesObservable.next(this.samples);
      this.samples = [];
      this.destroyReader();
    }
    else {
      await Swal.fire({
        title: 'Leyendo huella',
        text: 'Por favor coloque su dedo en el lector',
        icon: 'info',
      });
    }
  }

  private async initReaderObservable(cantidad: number = 1) {
    this.reader.on('DeviceConnected', this.onDeviceConnected);
    this.reader.on('DeviceDisconnected', this.onDeviceDisconnected);
    this.reader.on('ErrorOccurred', this.onReaderError);
    cantidad === 1 ? this.reader.on('SamplesAcquired', this.onSampleAcquired)
      : this.reader.on('SamplesAcquired', this.onSampleAcquiredMultiple);
    this.reader.on('AcquisitionStarted', this.onAcquisitionStarted);
    await this.reader.startAcquisition(SampleFormat.PngImage).then(() => {
      Swal.fire({
        title: 'Leyendo huella',
        text: 'Por favor coloque su dedo en el lector',
        icon: 'info',
      });
    }).catch(() => {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo iniciar la captura',
        icon: 'error',
      });
    });
  }

  private async destroyReader() {
    await this.reader.stopAcquisition();
    this.reader = this.reader.off();
  }

  leerHuella(cantidad = 1) {
    console.log('hola mundo');
    this.initReaderObservable(cantidad);
    return this.sampleObservable.asObservable();
  }

  leerHuellas() {
    this.initReaderObservable(3);

    return this.samplesObservable.asObservable();
  }

  leerHuellaDestroy() {
    this.destroyReader();
  }


}
