import React,{Component} from 'react';


class Check extends Component{



    render(){
        const {validado,id}=this.props;
        // console.log(this.props.disabled);
        // cambio
        // Desactiva los check de acuerdo al perfil del usuario
        var perfil = localStorage.getItem('perfil');
        var inactivo = false;
        if(perfil == '5') inactivo = true;
        // console.log(this.props)
        return (
            (validado) ? (<input id={id} disabled={inactivo} type="checkbox" className="DatosCSS-input-checkbox"  defaultChecked  onClick={(e)=>{this.props.change(e,id)}}/>)
                       : (<input id={id} disabled={inactivo} type="checkbox" className="DatosCSS-input-checkbox"  onClick={(e)=>{this.props.change(e,id)}}/> )
        );
}


}
export default Check;
