import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(public storage: Storage) {
  }

  async globalinyectado(){
    return await new Promise ((resultado) => {
      this.storage.get('idusu').then(res => {resultado(res)})
    });
  }
}
