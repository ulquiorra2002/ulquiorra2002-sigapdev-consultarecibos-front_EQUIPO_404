import React, { Component } from 'react';
import { Modal, ModalFooter, ModalHeader, ModalBody, Button, Label, Input,InputGroup,InputGroupAddon,InputGroupText } from 'reactstrap';
//import {Modal,ModalManager,Effect} from 'react-dynamic-modal';
import './css/bootstrap.css';
import URL from "./API/API";
import swal from 'sweetalert';
import ReactDOM from 'react-dom'; 
import Listardatos from './ListarComprobantes';

import './css/nuevo.css';

class ModalAsignar extends Component {

    constructor(props) {
        super(props);
        this.handlerGuardar = this.handlerGuardar.bind(this);
        this.close = this.close.bind(this);
        this.texto = React.createRef();
        this.state = {
            modal: false,
            codigoAlumno: this.props.alumno[0]?this.props.alumno[0].cod_alumno:"",
            programa: this.props.id_programa,
            alumno:this.props.alumno,
            apepat: this.props.alumno[0]?this.props.alumno[0].ape_paterno:"",
            apemat: this.props.alumno[0]?this.props.alumno[0].ape_materno:"",
            names: this.props.alumno[0]?this.props.alumno[0].nom_alumno:"",
            recibo: this.props.recibo?this.props.recibo:"",
            nombreCompleto: this.props.nombre?this.props.nombre:"",
            fechaRecibo: this.props.fecha?this.props.fecha:"",
            sigla_programa: this.props.siglaPrograma?this.props.siglaPrograma:"",
            id_alum: this.props.id_alum,
            alumnos:[]
        }
        
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputIngreso = this.handleInputIngreso.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.asignarAlumno = this.asignarAlumno.bind(this);
        this.handleInputNames = this.handleInputNames.bind(this);
        this.handleInputApepat = this.handleInputApepat.bind(this);
        this.handleInputApemat = this.handleInputApemat.bind(this);
        this.handleInputDni = this.handleInputDni.bind(this);
    }

    componentWillMount() {
        this.setState({
            modal: this.props.estado
        })
    }
    handlerGuardar() {
        let data = this.texto.current.value;
        // console.log(data);
        this.props.change(data, this.props.id_rec);
        //  ModalManager.close();
        this.setState({
            modal: false
        })
    }
    close() {
        this.setState({
            modal: false
        });
 
        // <Listardatos listado={[]}/>
    }

    //--------------- FUNCIONES PARA TRAER DATOS DE LA API
    /*
    getProgramas() {
        let url = URL.url.concat("programas");
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }
    */
    /*
    getDatosAlumno() {
        console.log("ni funciona");
        console.log(this.props);
        let url = URL.url.concat("alumnos/" + this.props.recibo);
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        alumno: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }
    */
    /////////////////////////////////////////////
    /////////////////////////////////////////////
    /////////////////////////////////////////////
    //Nuevas funciones para traer datos de la API
    fnMostrarAsignacionesDisponibles(){
        console.log(this.props);
        let url = URL.url.concat("asignacionesDisponibles");
        //Variables de Json
        
        let nombre = (this.state.names).toUpperCase();
        let app_pat = (this.state.apepat).toUpperCase();
        let app_mat = (this.state.apemat).toUpperCase();
        let codigo = this.state.codigoAlumno?this.state.codigoAlumno:"-";
        let dni = this.state.dni;

        console.log(JSON.stringify({
            nombre: nombre,
            app_pat: app_pat,
            app_mat: app_mat,
            codigo: codigo,
            dni: dni
        }));
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                app_pat: app_pat,
                app_mat: app_mat,
                codigo: codigo,
                dni: dni
            })

        }).then(res => {
                return res.json();
        }).then(res => {
            console.log(res);
            /**************Al abrir el modal me sale un warn y no puedo mostrar los datos*************/
            
            this.setState({
                alumnos: res.data //todos los datos
            });
            
            try {
                let telefonos = res.data[0].ids.split("/");
                this.setState({
                    codigoAlumno: telefonos[0],
                    programa: parseFloat(telefonos[1])
                });
            } catch (error) {
                swal("Alumno no encontrado!!!", "Verifique que los datos sean correctos e intente nuevamente", "error");
                console.log("No se encuentra la data: ",error);
            }

            

            //let telefonos = res.data[0].ids.split("/"); //res.data[0].ids.split("/")//this.props.alumno[0]?this.props.alumno[0].cod_alumno:"",
            
            /*
            this.setState({
                codigoAlumno: telefonos[0],
                programa: parseFloat(telefonos[1])
            });
            console.log(this.state, "<------------------------------------");
            console.log(telefonos,"<***************************") ;
            */
        });

    }

    //La ruta para asignar está aqui 
    //--> router.post('/asignarCodigoPrograma', algrmts.fnAsignarCodigoAlumnoIdPrograma);
    /*
    Usa este JSON
    {
	"cod_alumno": "12980989",
	"id_programa": "2",
	"numero_recibo": "10287706"
    }

    */


    
    //Funcion de asignación - v.Anterior
    asignarAlumno() {
            if(this.state.codigoAlumno != ""){
                console.log(this.props);
            let url = URL.url.concat("asignarCodigoPrograma");


            console.log("-------------------------");
            console.log(JSON.stringify({
                cod_alumno: this.state.codigoAlumno, 
                id_programa: this.state.programa,
                numero_recibo:this.state.recibo
            }));

            console.log("-------------------------");
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cod_alumno: this.state.codigoAlumno, 
                    id_programa: this.state.programa,
                    numero_recibo:this.state.recibo
                })

            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status === 'success') {
                        swal("Alumno asignado", "Los datos del alumno fueron asignados correctamente", {
                            icon: "success",
                            closeOnClickOutside: false
                        })
                            .then((asigned) => {
                                if (asigned) {
                                    // this.Listardatos.setState({data:[]});
                                    this.close();
                                }
                            });
                    } else {
                        swal("Alumno no asignado", "El alumno no pudo ser asignado", "error");
                    }
                    // JDLC ADD => Call updateTable
                    this.props.triggerTableUpdate();
                });
            }else{
                swal("Busque el alumno antes de asignar", "Código y/o programa no seleccionados - Intente nuevamente", "error");
            }
      

    }

    editAsignacion() {
        let url = URL.url.concat("editAsignar");
        console.log(url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

 

    handleInputName(e) {
        this.setState({
            codigoAlumno: e.target.value
        });
        console.log(this.state);
    }

    handleSelect(e) {
        let telefonos = e.target.value.split("/");
        this.setState({
            codigoAlumno: telefonos[0],
            programa: parseFloat(telefonos[1])
        });
        console.log(this.state);
        console.log(telefonos);
    }

    handleInputIngreso(e) {
        this.setState({
            ingreso: e.target.value
        });
        console.log(this.state);
    }

    handleInputNames(e){
        this.setState({
            names: e.target.value
        });
        console.log(this.state);
    }

    handleInputApepat(e){
        this.setState({
            apepat: e.target.value
        });
        console.log(this.state);
    }

    handleInputApemat(e){
        this.setState({
            apemat: e.target.value
        });
        console.log(this.state);
    }

    handleInputDni(e){
        this.setState({
            dni: e.target.value
        });
        console.log(this.state);
    }


    render() {

        console.log('--------> ',this.state.sigla_programa);
        let button;
        if(this.state.codigoAlumno.length>0){
            button = <Button color="success" id="btnAsignar">ASIGNADO</Button>
        }

        const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.close}>&times;</button>;
        return (
            <div>
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
                    <div id="principal">
                        
                        <ModalBody>
                            <div className="modal-centrado">
                                <h4 className="reducir">Estudiante </h4>
                                <div id="separar-1" >
                                    <InputGroup id="separar2">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>Codigo</InputGroupText>
                                        </InputGroupAddon>
                                        <Input disabled value={this.state.codigoAlumno}/>
                                    </InputGroup>
                                </div>
                               <div id="separar-2">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>Programa</InputGroupText>
                                        </InputGroupAddon>
                                        <Input disabled value={this.state.sigla_programa}/>
                                    </InputGroup>
                               </div>
                            </div>
                            

                            <div className="modal-centrado"> 
                                <Label >Nombre:</Label>
                                <Input value={this.state.nombreCompleto} type="text" className="form-control" disabled/>
                            </div>

                            <div className="modal-centrado"> 
                                <InputGroup >
                                    <div id="columna">
                                        <Label >Número de recibo:</Label>
                                        <br></br>
                                        <Input value={this.state.recibo}  type="text" className="form-control" disabled/>
                                        <br></br>
                                    </div>
                                    <div id="columna">
                                        <Label >Fecha de recibo:</Label>
                                        <Input value={this.state.fechaRecibo.substring(0,10)}  type="text" className="form-control" disabled/>
                                        <br></br>
                                    </div>
                                </InputGroup>
                                                    
                            </div>

                            <div className="modal-centrado">
                                <h5 className="reducir"> Campos de busqueda:</h5>
                            </div>
                            <div className="modal-centrado"> 

                                <InputGroup>
                                     <div id="columna">
                                    <Label >Código de alumno:</Label>
                                    <Input value={this.state.codigoAlumno} onChange={this.handleInputName} type="text" className="form-control" placeholder="ingrese código del alumno" />
                                    {/* {!this.props.codigoAlu ? <Label >Año de ingreso:</Label> : null}
                                    {!this.props.codigoAlu ? <Input value={this.state.ingreso} onChange={this.handleInputIngreso} type="text" className="form-control" placeholder="ingrese año de ingreso" /> : null} */}
                                    </div>
                                    <div id="columna">
                                        <Label >DNI:</Label>
                                        <Input value={this.state.dni} type="text" onChange={this.handleInputDni} className="form-control"  placeholder="ingrese el DNI"/>
                                    </div>
                                    <div id="columna">
                                        { button }
                                    </div>
                                </InputGroup>

                            </div>

                            <div className="modal-centrado">
                                <InputGroup>
                                    <div id="columna">
                                        <Label >Apellido paterno:</Label>
                                        <Input value={this.state.apepat} style={{ display:'block'}}  type="text" onChange={this.handleInputApepat} className="form-control" placeholder="ingrese apellido paternos" />
                                    </div>
                                    <div id="columna">
                                        <Label >Apellido materno:</Label>
                                        <Input value={this.state.apemat}  type="text" onChange={this.handleInputApemat} className="form-control" placeholder="ingrese apellido materno" />                            
                                    </div>

                                    <div id="columna">
                                        <Label >Nombres:</Label>
                                        <Input value={this.state.names} style={{ display:'block'}} type="text" onChange={this.handleInputNames} className="form-control"  placeholder="ingrese nombres"/>
                                    </div>
                                </InputGroup>
                            </div> 
                            
                            <div className="left-bottom">
                               <Button color="info"  onClick={(e) => this.fnMostrarAsignacionesDisponibles()}>Buscar</Button>
                            </div>

                        {this.state.alumnos.length>0 ?<Label for="exampleSelectMulti">Resultados de busqueda:</Label>:null}                      
                           {/*  <Input value={this.state.programa} onChange={this.handleSelect} type="select" name="select" id="exampleSelect">
                            {
                                this.props.programas.map(programa => <option value={programa.id_programa} key={programa}> {programa.nom_programa} </option>)
                            }
                            </Input> */}
                          {this.state.alumnos.length>0 ?  <Input onChange={this.handleSelect} type="select" name="select" id="exampleSelect">
                            {
                                this.state.alumnos.map((alumno,index) => <option value={alumno.ids} key={index}> {alumno.campos_para_asignar} </option>)
                            }
                            </Input>:null}
                            
                            <Button color="secondary" onClick={this.close}>Cerrar</Button>
                            <Button id = "triggerUpdateButton" color="info" onClick={(e) =>  this.asignarAlumno()}>Asignar</Button>
                        </ModalBody>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default ModalAsignar;
