import React, { Component } from 'react';
import Listardatos from './ListarComprobantes';
import URL from './API/API';
import { Link } from "react-router-dom";
import { ModalManager } from "react-dynamic-modal";
import Modal2 from "./MyModalNewC";
import Modal3 from "./MyModalNewFueraAlumno";
import Modal4 from "./MyModalNewFueraPrograma";

import './css/Content.css';
import './css/bootstrap.css';
import axios from 'axios';
import Check from './Check';
import Swal from 'sweetalert2';
var perfil = '';
var config = '';
var inactivo = false;
class Content extends Component {
    constructor() {
        super();

        this.state = {
            lista: null,
            nombre_apellido: "",
            concepto: "",
            dni: "",
            codigo: "",
            voucher: "",
            dates: "",
            dates2: "",
            mensaje: "",
            estado: false,
            operacion: '',
            isLoading: false,
            nombre: "",
            sigla: "",
            idPrograma: "",
            id: "",
            validado: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleSearchAddClick = this.handleSearchAddClick.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputConcepto = this.handleInputConcepto.bind(this);
        this.handleInputRecibo = this.handleInputRecibo.bind(this);
        this.handleInputDni = this.handleInputDni.bind(this);
        this.handleInputCodigo = this.handleInputCodigo.bind(this);
        this.handleSearchKey = this.handleSearchKey.bind((this));
        this.mostrarData = this.mostrarData.bind(this);
        this.limpiar = this.limpiar.bind(this)
        this.vaciado = this.vaciado.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleInputValidado = this.handleInputValidado.bind(this);
        // cambio
        perfil = localStorage.getItem('perfil');
        if (perfil == '5') inactivo = true;
    }



    handleAddClick(e, cod) {


        if (cod != "") {
            this.handleBuscaAlumnoPrograma();
            
            e.preventDefault()

        } else {
            // alert("Ingrese un código");
            Swal.fire(
                'Ingresar un código',
                '',
                'question'
            )
            e.preventDefault();
        }
    }
    handleBuscaAlumno() {
        let data;
        let nombrecorregido=this.state.nombre.replaceAll('Ñ','N');
        this.setState({
            nombre: nombrecorregido
        })
        var arra={
            nombre: this.state.nombre,
            dni: this.state.dni
        }
        const url = URL.url.concat('alumno/detallado/');
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arra,null,3)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    // if(JSON.stringify(apoyo)=='{}'){
                    //if(Object.keys(data).length === 0){
                    this.setState({
                        nombre: data["data"][0]["ape_nom"]
                    })
                    if(this.state.nombre!=""){
                        this.handleBuscaSigla();
                    }
                    console.log(this.state.id);
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            }).catch(err => {
                Swal.fire({
                    title: 'Código no encontrado en el Alumno',
                    text: "Desea ingresar el recibo?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.handleBuscaSiglaFueraAlumno();
                    }
                })
                console.log(err);
            }
            )
            ;
    }
    handleBuscaSiglaFueraAlumno(){
        let data;
        let linksigla = 'alumno/sigla/'
        let codigo1 = linksigla.concat(this.state.idPrograma);
        const url1 = URL.url.concat(codigo1);
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url1, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    // if(JSON.stringify(apoyo)=='{}'){
                    //if(Object.keys(data).length === 0){
                    this.setState({
                        sigla: data["data"][0]["sigla"]
                    })
                    ModalManager.open(
                        <Modal3
                            id={this.state.id}
                            sigla={this.state.sigla}
                            dni={this.state.dni}
                            codigo={this.state.codigo}
                            nombre={this.state.nombre}
                            idPrograma={this.state.idPrograma}
                        />
                    )
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            })
    }
    handleBuscaSigla(){
        let data;
        let linksigla = 'alumno/sigla/'
        let codigo1 = linksigla.concat(this.state.idPrograma);
        const url1 = URL.url.concat(codigo1);
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url1, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    // if(JSON.stringify(apoyo)=='{}'){
                    //if(Object.keys(data).length === 0){
                    this.setState({
                        sigla: data["data"][0]["sigla"]
                    })
                    ModalManager.open(
                        <Modal2
                            id={this.state.id}
                            sigla={this.state.sigla}
                            dni={this.state.dni}
                            codigo={this.state.codigo}
                            nombre={this.state.nombre}
                            idPrograma={this.state.idPrograma}
                        />
                    )
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            })
    }
    handleBuscaRecaudacion() {
        let data;
        let link = 'alumno/recaudacion/'
        let codigo = link.concat(this.state.codigo);
        const url = URL.url.concat(codigo);
        //console.log(this.props);
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    this.setState({
                        id: data["data"][0]["id_alum"]
                    })
                    console.log("Alumno encontrado en reccaudaciones");
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            })
            ;
    }
    handleBuscaAlumnoPrograma() {
        let data;
        let link = 'alumno/programa/'
        let codigo = link.concat(this.state.codigo);
        const url = URL.url.concat(codigo);
        //console.log(this.props);
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    let apo=" ";
                    let ape_pa = data["data"][0]["ape_paterno"];
                    let ape_ma= data["data"][0]["ape_materno"];
                    let nom=data["data"][0]["nom_alumno"];
                    ape_pa=ape_pa.concat(' ');
                    ape_pa=ape_pa.concat(ape_ma);
                    ape_pa=ape_pa.concat(' ');
                    ape_pa=ape_pa.concat(nom);
                    this.setState({
                        dni: data["data"][0]["dni_m"],
                        idPrograma: data["data"][0]["id_programa"],
                        nombre: ape_pa
                    })
                    console.log(this.props);
                    this.handleBuscaAlumno();
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            }).catch(err => {
                this.handlebuscaalumnocodigo()
            })
            ;
    }
    handlebuscaalumnocodigo(){
        let data;
        let nombrecorregido=this.state.nombre.replaceAll('Ñ','N');
        this.setState({
            nombre: nombrecorregido
        })
        var arra={
            codigo: this.state.codigo
        }
        const url = URL.url.concat('alumno/detallado/codigo/');
        // const url= 'https://api-modulocontrol.herokuapp.com/conceptos';
        fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arra,null,3)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    data = res;
                    // if(JSON.stringify(apoyo)=='{}'){
                    //if(Object.keys(data).length === 0){
                    this.setState({
                        nombre: data["data"][0]["ape_nom"]
                    })
                    if(this.state.nombre!=""){
                        alert("alumno no encontrado en alumno_programa pero si existente en alumno")
                    }
                    console.log(this.state.id);
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde");
                }
            }).catch(err => {
                Swal.fire({
                    title: 'Alumno no encontrado',
                    text: "Desea ingresar el recibo?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si'
                }).then((result) => {
                    if (result.isConfirmed) {
                        ModalManager.open(
                            <Modal4
                                id={this.state.id}
                                codigo={this.state.codigo}
                                nombre={this.state.nombre}
                                idPrograma={this.state.idPrograma}
                            />
                        )
                    }
                })
                console.log(err);
            }
            )
            ;

        
    }
    async handleSearchAddClick(e) {

        let url = URL.url.concat('recaudaciones/detallada/');

        if (this.state.dni === "" && this.state.codigo === "") {

            Swal.fire(
                'Buscadores vacíos',
                'Ingresar dato(s) en el(los) buscador(es) que desea',
                'question'
            )
        } else {
            let arra = {
                "nombre": this.state.nombre_apellido,
                "periodoI": this.state.dates,
                "id_concepto": this.state.concepto,
                "periodoF": this.state.dates2,
                "voucher": this.state.voucher,
                "dni": this.state.dni,
                "codigo": this.state.codigo,
                "validado": this.state.validado
            };
            let arra2 = [arra]

            this.setState({
                isLoading: true,
                mensaje: "",
                operacion: "c"
            });

            let response = await fetch(url, {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arra, null, 2)

            })
            const responseJson = await response.json();

            if (responseJson) {

                this.setState({
                    lista: responseJson.data, //Todos los datos
                    estado: true,
                    operacion: (responseJson.data !== null && responseJson.data.length !== 0),
                    mensaje: (responseJson.data !== null && responseJson.data.length !== 0) ? ("") : ("Datos no encontrados"),
                    isLoading: false,
                    nombre: responseJson.data[0].nombre,
                    sigla: responseJson.data[0].sigla_programa,
                    idPrograma: responseJson.data[0].id_programa,
                    id: responseJson.data[0].id_alum
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'No existe',
                    text: 'El dato ingresado no existe en el sistema',
                })
            }

        }
        e.preventDefault();
    }

    // leer del input Concepto
    handleInputConcepto(data) {
        this.setState({
            concepto: data.target.value,
            mensaje: ""
        });
    }
    mostrarData() {
        let contenedor = "";
        if (this.state.estado) {
            // console.log(this.state.lista);
            switch (this.state.operacion) {
                case "V": contenedor = (<div className="alert alert-info">{this.state.mensaje}</div>); break;
                case true: contenedor = (<div><Listardatos listado={this.state.lista}
                    /* JDLC ADD => DATA TO ListarComprobantes Component */
                    nombreUpdate={this.state.nombre_apellido}
                    periodoIUpdate={this.state.dates}
                    conceptoUpdate={this.state.concepto}
                    periodoFUpdate={this.state.dates2}
                    voucherUpdate={this.state.voucher}
                    dniUpdate={this.state.dni}
                    codigoUpdate={this.state.codigo}

                /></div>); break;
                case false: contenedor = (<div className="alert alert-info">{this.state.mensaje}</div>); break;
                default: contenedor = (<div></div>);
            }
        }
        return contenedor;
    }

    handleInputValidado(data) {
        this.setState({
            validado: !this.state.validado,
            mensaje: "",
            operacion: "c"
        })
    }
    //leer del input recibo
    handleInputRecibo(data) {
        this.setState({
            voucher: data.target.value,
            mensaje: "",
            operacion: "c"
        });
    }
    //leer del input DNI
    handleInputDni(data) {
        this.setState({
            dni: data.target.value,
            mensaje: "",
            operacion: "c"
        });
    }
    //leer del input Codigo
    handleInputCodigo(data) {
        this.setState({
            codigo: data.target.value,
            mensaje: "",
            operacion: "c"

        });
    }
    // funcion del calendario en date se almacena la fecha seleccionada
    handleChange(date) {
        this.setState({
            dates: date.target.value,
            mensaje: "",
            operacion: "c"
        });
        console.log(date.target.value);
        console.log(this.state.dates);
    }
    handleChange2(date) {
        this.setState({
            dates2: date.target.value,
            mensaje: "",
            operacion: "c"
        });
        //  console.log(this.state.dates2);
    }

    // ingresar texto
    handleInputName(e) {
        if (e.target.id === "busca") {
            this.setState({
                nombre_apellido: e.target.value,
                mensaje: "",
                operacion: "c"
            });
        }
    }
    handleSearchKey(e) {
        //if(e.key==="enter"){
        //  this.handleSearchClick();
        //}
        document.Form.DefaulButton = 'enter'
    }
    vaciado() {
        this.setState({

            nombre: "",
            id_concepto: "",
            dni: "",
            codigo: "",
            voucher: "",
            periodoI: "",
            periodoF: ""

        })
    }
    limpiar = (even) => {
        //  even.preventDefault();

        this.refs.formulario.reset()
        //this.vaciado()
        console.log("DSAEW");
        console.log(this.state);
        //  even.preventDefault();
    }
    //buscar
    handleSearchClick(e) {

        let url = URL.url.concat('recaudaciones/detallada/');
        // console.log(url);
        if (this.state.nombre_apellido === "" && this.state.concepto === "" && this.state.voucher === "" &&
            this.state.dates2 === "" && this.state.dates === "" && this.state.dni === "" && this.state.codigo === "") {
            // this.setState({
            //     mensaje: "Casilleros vacios",
            //     estado: true,
            //     operacion: 'V',
            //     lista: [],
            //     isLoading: false
            // });
            Swal.fire(
                'Buscadores vacíos',
                'Ingresar dato(s) en el(los) buscador(es) que desea',
                'question'
            )
        } else {
            let arra = {
                "nombre": this.state.nombre_apellido,
                "periodoI": this.state.dates,
                "id_concepto": this.state.concepto,
                "periodoF": this.state.dates2,
                "voucher": this.state.voucher,
                "dni": this.state.dni,
                "codigo": this.state.codigo,
                "validado": this.state.validado
            };
            let arra2 = [arra]

            console.log("arra2");
            console.log(arra2);
            this.setState({
                isLoading: true,
                mensaje: "",
                operacion: "c"
            });
            //console.log(arra);
            fetch(url, {

                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arra, null, 2)

            })
                .then((response) => {
                    console.log(response);
                    return response.json()

                })
                .then(responseJson => {
                    this.setState({
                        lista: responseJson.data, //Todos los datos
                        estado: true,
                        operacion: (responseJson.data !== null && responseJson.data.length !== 0),
                        mensaje: (responseJson.data !== null && responseJson.data.length !== 0) ? ("") : ("Datos no encontrados"),
                        isLoading: false,
                        nombre: responseJson.data[0].nombre,
                        sigla: responseJson.data[0].sigla_programa,
                        idPrograma: responseJson.data[0].id_programa,
                        id: responseJson.data[0].id_alum
                    });
                    //console.log( responseJson.data.length);
                })
                .catch(err => {

                    if (!(this.state.codigo === "")) {
                        
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'No existe',
                            text: 'El dato ingresado no existe en el sistema',
                        })
                    }
                });

        }
        e.preventDefault();
    }
    /*  handleKeyPress = (event) => {
          if(event.key === 'Enter'){
              this.handleSearchClick();
          }
      };*/

    //Funcion logout antes del render.
    logout(e) {
        e.preventDefault()
        localStorage.removeItem('user')
        // cambio
        // Tambien hay un cambio en el boton Agregar con el atributo disabled
        localStorage.removeItem('perfil');
        localStorage.removeItem('config');
        window.location = "/login"
    }

    render() {
      //  console.log(this.state.nombre_apellido);
        return (
            <div className="content">

                <div className="buscar">
                    <form ref="formulario" onSubmit={this.Limpiar} >
                        <div className="input-group mb-3 col-xs-12">
                            <div className="input-group mb-3 col-xs-12 col-sm-12 col-md-12 col-lg-6">

                                <div className="input-group-prepend input_nombre ">
                                    <span className="input-group-text " id="basic-addon1">Nombre o Apellido</span>
                                </div>
                                <input id="busca" type="text" className="form-control" name="nombre" value={this.state.nombre_apellido} onChange={this.handleInputName} placeholder="nombre o apellido" aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>

                            <div className="input-group mb-3 col-xs-12 col-sm-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend input_pago">
                                    <span className="input-group-text" id="basic-addon1">Concepto de Pago</span>
                                </div>
                                <input id="concepto" type="text" className="form-control" name="id_concepto" value={this.state.concepto} onChange={this.handleInputConcepto} placeholder="ejem:123,123,123" aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                        </div>

                        <div className="input-group mb-3 col-xs-12 ">
                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6 ">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">DNI</span>
                                </div>
                                <input id="dni" type="text" className="form-control" name="dni" value={this.state.dni} onChange={this.handleInputDni} placeholder="DNI" aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Codigo</span>
                                </div>
                                <input id="codigo" type="text" className="form-control" name="codigo" value={this.state.codigo} onChange={this.handleInputCodigo} placeholder="codigo" aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                        </div>

                        <div className="input-group mb-3 col-xs-12">
                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Desde:</span>
                                </div>
                                <input type="date" className="form-control" name="periodoI" onChange={this.handleChange} aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Hasta</span>
                                </div>
                                <input type="date" className="form-control" name="periodoF" onChange={this.handleChange2} aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>
                        </div>
                        <div className="input-group mb-3 col-xs-12 ">
                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Nro de Recibo</span>
                                </div>
                                <input id="recibo" type="text" className="form-control" name="voucher" onChange={this.handleInputRecibo} placeholder="ejem:cod1,cod2,..." aria-label="Username" aria-describedby="basic-addon1"
                                    onKeyPress={this.handleKeyPress} />
                            </div>

                            <div className="input-group mb-3 col-xs-12 col-md-12 col-lg-6">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Verificar</span>
                                </div>
                                <input type="checkbox" onChange={this.handleInputValidado} className="DatosCSS-input-checkbox mt-2 ml-2" />
                            </div>
                            <div className="cont_boton input-group mb-3 col-xs-12  text-center">
                                <div className="Botones">
                                    <div className="Buton-contenedor">
                                        <button id="Buscar" onClick={this.handleSearchClick} className="btn btn-primary">Buscar </button>
                                        <button id="Agregar" onClick={e => this.handleAddClick(e, this.state.codigo)} className="btn btn-primary" disabled={inactivo} >Agregar</button>
                                        <button id="Limpiar" onClick={this.limpiar} className="btn btn-primary">Limpiar </button>
                                        <a className="btn btn-primary" href="" onClick={this.logout} >Salir</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>

                </div>
                <div className={(this.state.isLoading) ? ("isLoading") : ("listar")}>
                    {this.mostrarData()}
                </div>

            </div>


        );

    }
}
export default Content;
