import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse,Gif } from '../interface/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey      : string  ='TU6sVQf1bBQF7S3ht2nTou9ZGBbmjMGq';
  private servicioUrl : string  = 'http://api.giphy.com/v1/gifs';
  private _historial  : string[]=[];

  public resultado: Gif[]=[];

  get historial(){
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultado = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query:string = ''){

    query= query.trim().toLocaleLowerCase();

    // No pasa nada si el campo esta limpio
    if (query.trim().length===0) {
      return;
    }
    // no inserta repetidos
    if (!this._historial.includes(query)){
      this._historial.unshift(query);
      // no pasa de 10 
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial',JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('api_key',this.apiKey)
          .set('limit','10')
          .set('q',query);
        
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
    .subscribe((resp)=>{
      console.log(resp.data);
      this.resultado = resp.data;
      localStorage.setItem('resultados',JSON.stringify(this.resultado))
    })
  }
}
