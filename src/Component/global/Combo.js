import React,{Component} from 'react';

import  './css/Combo.css';
import './css/bootstrap.css';

//import Datos from './Datos/Items';
class Combo extends Component{
    constructor(...props){
        super(...props);
        this.handlerGuardar=this.handlerGuardar.bind(this);
    }
    //id_tipo
    //descripcion



    handlerGuardar(e){
        this.props.val(e.target.value,this.props.id_rec);
    }



    //selected={key===val?(true):(false)}>{item.nombre}

    render(){
        const {items}=this.props;
        // cambio
        // Desactiva el select de acuerdo al perfil del usuario
        var perfil = localStorage.getItem('perfil');
        var inactivo = false;
        if(perfil == '5') inactivo = true;
        return(
          <select className="custom-select" onChange={this.handlerGuardar} id="inputGroupSelect01" disabled={inactivo}>
            {items && items.sort((a,b)=>{
                if(a.id_ubicacion>b.id_ubicacion){
                    return 1;
                }else if(a.id_ubicacion<b.id_ubicacion){
                    return -1;
                }
                return 0;
            }).map((item,key)=><option key={key} id={key} value={item.id_ubicacion} selected={key===this.props.ubic?(true):(false)}>{item.descripcion}</option>)}
          </select>
        );
    }

}

export default Combo;
