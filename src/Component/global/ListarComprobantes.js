import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MyModal from './MyModal';
import Modal2 from './Modal2';
import Combo from './Combo';
import URL from './API/API';
import Check from './Check';
import MyModalUpg from './MyModalUpg';
import Listardatos from './ListarComprobantes';
import './css/DatosCSS.css';
import './css/bootstrap.css';
import './css/bootstrap.min.css';
//import Datos from './Datos/Items';
import swal from 'sweetalert';
import ModalAsignar from './ModalAsignar';

import {FaCheck} from 'react-icons/fa';
import {FaWindowClose} from 'react-icons/fa';

class ListarComponentes extends Component {
    constructor(...props) {
        super(...props);
        this.handleEnviarData = this.handleEnviarData.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openModalUpg = this.openModalUpg.bind(this);
        this.handleChangeObs_comentarios = this.handleChangeObs_comentarios.bind(this);
        this.handleChangeObs_upg = this.handleChangeObs_upg.bind(this);
        this.handleChangeUbic = this.handleChangeUbic.bind(this);
        this.Obj = this.Obj.bind(this);
        this.handleChangeEstado = this.handleChangeEstado.bind(this);
        this.crearJSON = this.crearJSON.bind(this);
        this.verificar = this.verificar.bind(this);
        this.groupBy = this.groupBy.bind(this);
        this.eventoNombre = this.eventoNombre.bind(this);

        //Cambios
        this.asignar_desasignar = this.asignar_desasignar.bind(this);
        this.desasignarAlumno = this.desasignarAlumno.bind(this);

        //JDLC ADD => FUNCTION
        this.updateTable = this.updateTable.bind(this);

        this.state = {
            data: null,
            dataOrdenada: null,
            ubicDato: [],
            JSON: [],
            isLoading: false,

            // oculto:true,
            addClass     : false,

            //JDLC ADD => STATE
            rerender     : false
        }
    }

    //JDLC ADD => DIDUPDATE LIFECICLE
    componentDidUpdate(prevProps, prevState){
        
        if(prevState.rerender !== this.state.rerender){

            /*MY NAME IS BIG BOY */
            let url = URL.url.concat('recaudaciones/detallada/');
            let arra = {
               "nombre"     : this.props.nombreUpdate,
               "periodoI"   : this.props.periodoIUpdate,
               "id_concepto": this.props.conceptoUpdate,
               "periodoF"   : this.props.periodoFUpdate,
               "voucher"    : this.props.voucherUpdate,
               "dni"        : this.props.dniUpdate,
               "codigo"     : this.codigoUpdate
           };

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
                   console.log(responseJson);
                   let orderedList = responseJson.data.sort((a,b) => {
                    if (a.nombre > b.nombre) return 1;
                    
                    if (a.nombre < b.nombre) return -1;
                    
                    return 0;
                   });

                   this.setState({ data: orderedList });
               });
            /*END BIG BOY */
        }
    }

    updateTable(){
        this.setState({rerender: !this.state.rerender});
    }

    componentWillMount() {
        let arreglo = [];
        const lista = this.props.listado;
        console.log("Esta es la lista");
        console.log(lista);
        if (lista !== null) {
            lista.map((item, key) => {
                arreglo = arreglo.concat(new this.Obj(item.id_rec, item.observacion, item.observacion_upg, item.id_ubicacion
                    && item.id_ubicacion, item.tipo, item.validado, item.nombre,
                    item.concepto, item.descripcion_min, item.nombre_programa, item.id_programa, item.sigla_programa,
                    item.id_registro, item.codigo, item.dni, item.recibo, item.moneda, item.mascara,
                    item.importe, item.fecha, item.id_alum
                ));
                return null;
            });
            const listadoOrdenado = arreglo.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                //iguales
                return 0;
            });
            //console.log(arreglo);
            this.setState({
                data: listadoOrdenado
            }/*, function () {
                console.log("call"+this.state.data)
            }*/);
            this.setState({
                data: arreglo
            });
            //console.log( listadoOrdenado );
            /*this.setState({
               dataOrdenada:listadoOrdenado
            });*/
        }        
        const url = URL.url.concat('ubicaciones');
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) { // exito
                    let dataTipo = res["data"];
                    this.setState({
                        ubicDato: dataTipo
                    });
         
                } else {
                    alert("Fallo al cargar datos, Intentelo mas tarde")
                }
            });
    }

    // crear un objeto para enviar al server
    crearJSON(id_rec, obs, obs_upg, flag, ubic) {
        if (obs == null) obs = "";
        if (obs_upg == null) obs_upg = "";
        if (ubic == null) ubic = 0;
        if (flag == null) flag = false;
        this.id_rec = id_rec;
        this.check = flag;
        this.obs = obs;
        this.obs_upg = obs_upg;
        this.ubic = ubic;
    }

    // funcion verifica los checks y las observaciones nuevas
    verificar() {
        const arreglo = this.state.data;
        let arreglo2 = [];
        arreglo.map(item => {
            arreglo2 = arreglo2.concat(new this.crearJSON(item.id_rec, item.obs, item.obs_upg, item.validado, item.ubic));
            return null;
        });
        this.setState({
            JSON: arreglo2
        });
        return arreglo2;
    }

    //crea un objeto para pasar al hijo
    Obj(id_rec, obs, obs_upg, ubic, tipo, validado, nombre, concepto, descripcion_min, nombre_programa, id_programa, sigla_programa, id_registro, codigo, dni, recibo,
        moneda, mascara, importe, fecha, id_alum) {
        this.id_rec = id_rec;
        this.obs = obs;
        this.obs_upg = obs_upg;
        this.ubic = ubic;
        this.tipo = tipo;
        this.validado = validado;
        this.nombre = nombre;
        this.concepto = concepto;
        this.descripcion_min = descripcion_min;
        this.nombre_programa = nombre_programa;
        this.id_programa = id_programa;
		this.sigla_programa = sigla_programa;
        this.id_registro = id_registro;
        this.codigo = codigo;
		this.dni = dni;
        this.recibo = recibo;
        this.moneda = moneda;
        this.mascara = mascara;
        this.importe = importe;
        this.fecha =
            fecha &&
            fecha.substr(8, 2) + "-" + fecha.substr(5, 2) + "-" + fecha.substr(0, 4);
        this.id_alum = id_alum;
        //console.log(convertDateFormat(fecha.substr(0,10)));
        if (fecha !== null) {
            let fTemp = fecha.substr(0, 10).split("-");
            let tam = fTemp.length, i = 0, fFinal = "";
            for (i = tam - 1; i >= 0; i--) {
                fFinal = fFinal + "/" + fTemp[i];
            }
            this.fecha = fFinal.slice(1, 11);
        }
        else this.fecha = fecha;
    }
    //recibe las ubicaciones de los archivos
    handleChangeUbic(ubic, id_rec) {
        //console.log(ubic);
        this.state.data.map(items => {
            if (items.id_rec === id_rec) {
                items.ubic = ubic;
            }
            return null;
        });
    }
    //recibe el estado de los checks cada vez que se pulsa sobre ellos
    handleChangeEstado(estado, id) {
        const validado = estado.target.checked;
        this.state.data.map(items => {
            if (items.id_rec === id) {
                items.validado = validado;
            }
            return null;
        });
        //  console.log(this.state.data);
    }

    // recibe la observacion y el id de recaudaciones modificados
    // los almacena o actualiza en el array
    handleChangeObs_comentarios(text, id_rec) {
        this.setState(prevState => (
            prevState.data.map(items => {
                if (items.id_rec === id_rec) {
                    items.observacion = text;
                }
                return null;
            },
                {
                    data: prevState.data
                })
        ));
        // console.log(this.state.data);
    }

    handleChangeObs_upg(text, id_rec) {
        this.setState(prevState => (
            prevState.data.map(items => {
                if (items.id_rec === id_rec) {
                    items.obs_upg = text;
                }
                return null;
            },
                {
                    data: prevState.data
                })
        ));
        //console.log(this.state.data);
    }
    groupBy(xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
    // abre el componente MyModal para ingresar observaciones
    openModal(e, o) {
        //https://github.com/xue2han/react-dynamic-modal        
        let id = e;
        let obs = o;
        // console.log(text);
        //let id_re = e.target.name;
        let component = <MyModal id_rec={id} obs={obs} onChange={this.handleChangeObs_comentarios} estado={true} />;
        let node = document.createElement('div');
        ReactDOM.render(component, node);

    }

    // ===========================================
    // MODAL PARA ASIGNAR
    // ============================================

    //Desasignación de la vista principal Asignar/Desasignar
    desasignarAlumno(programa,sigla_programa,codigoAlu) {

        console.log(programa);
        console.log(sigla_programa);
        console.log(codigoAlu);


        if(programa == "" || programa == null || codigoAlu == "" || codigoAlu==null){
            swal("Alumno(a) desasignado(a)","El(La) alumno(a) ya se encuentra desasignado(a)","error");
        }else{
              swal("Confirmar","¿Esta seguro(a) de desasignar el(la) alumno(a)?",{ icon: "warning",
        buttons: ['Cancelar', 'Confirmar'],
        closeOnClickOutside: false})
        .then((confirm)=>{
            if(confirm){
                let url = URL.url.concat("desasignarRecibo");

        
                try {
                    let codigoAlumno=this.state.alumno[0].codigo;
                    let idAlumno=this.state.alumno[0];
                    //Variable recibo
                    let numRecibo=this.state.alumno[0].numero_recibo;

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({numRecibo:numRecibo})
                }).then(res => res.json())
                    .then(res => {
                        console.log(res);
                        if(res.status==='success'){
                            /*
                            /////////////////////////
                            Al agregar, se tiene q actualizar automáticamente
                            
                            //Error
                            this.data[0].codigo = "312312";
                            this.data[0].id_programa = "4323232";
                            */
                            
                            swal("Alumno desasignado","El alumno fue desasignado exitosamente",{ icon:"success",
                            closeOnClickOutside: false})
                            .then((desasigned)=>{
                                if(desasigned){
                                    // this.Listardatos.setState({data:[]});
                                }
                            });
                        }else{
                            swal("Alumno(a) no desasignado(a)","El(La) alumno(a) no pudo ser desasignado(a)","error");
                        }
                        this.updateTable();
                    });
                } catch (error) {
                    swal("Alumno(a) desasignado(a)","El(La) alumno(a) ya se encuentra desasignado(a)","error");

                    console.log("Error de asignación de datos: ", error);
                }
            }
        });
        }
      
    }
   
        asignar_desasignar(numRecibo,codigoAlu,programa,tipo,id_alum,nombreCompleto, fechaRecibo,sigla_programa) 
        {

        console.log("*********", sigla_programa);
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
                    });

                    let url1 = URL.url.concat("alumnos/" + numRecibo);
                    console.log(url1);
                    fetch(url1, {
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
                                });
                                console.log(this.state);

                                if(tipo===1){
                                    let component = <ModalAsignar 
                                    codigoAlu={codigoAlu}
                                    id_programa={programa?programa:8} 
                                    recibo={numRecibo} 
                                    nombre = {nombreCompleto} 
                                    fecha = {fechaRecibo}
                                    id_alum={id_alum} 
                                    siglaPrograma = {sigla_programa}
                                    alumno={this.state.alumno} 
                                    programas={this.state.programas}
                                    estado={true} 
                                     
                                    // JDLC ADD => Funtion trigger as prop
                                    triggerTableUpdate = {this.updateTable}
                                     />;
                                    let node = document.createElement('div');
                                    ReactDOM.render(component, node);
                                }else{
                                    if(tipo===2){
                                      this.desasignarAlumno(programa,sigla_programa,codigoAlu);
                                    }
                                }
                            } else {
                                console.log("error");
                            }
                        });
                } else {
                    console.log("error");
                }
            });
            console.log(this.state);
    }

    // ===========================================
    // MODAL PARA ASIGNAR
    // ============================================



    openModalUpg(e) {
        let id = e;        
		const url = URL.url.concat("recaudaciones/observaciones/" + id);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                if (res.status) {
                    this.setState({
                        obsUpg: res.data
                    })
                    let component = <MyModalUpg id_rec={id} obs_upg={res.data} onChange={this.handleChangeObs_upg} estado={true} />;
                    let node = document.createElement('div');
                    ReactDOM.render(component, node);
                    //console.log(res);
                } else {
                    alert("FALLÓ OPERACIÓN, ESPERE UN MOMENTO Y VUELVA A INTENTARLO ")
                }
            });
    }
    // envia un JSON al server
    handleEnviarData() {        
        const arreglo = this.verificar();        
        const url = URL.url.concat('recaudaciones/id');
        this.setState({
            isLoading: true
        });
        fetch(url, {

            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(arreglo)
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) { // exito
                    this.setState({
                        isLoading: false
                    });
                    alert('Datos cargados exitosamente');
                }
            })
        // console.log(JSON.stringify(arreglo));
        //https://github.com/calambrenet/react-table/blob/master/src/react-table.jsx
    }
    eventoNombre(e) {

        let nom = e.target.innerHTML;
        let id = e.target.id;
        var groupList = [];
        var listadoOrdenado;
        //console.log(e.target.innerHTML);
        if (id === nom) {
            listadoOrdenado = this.state.data.sort(function (a, b) {
                if (a.nombre > b.nombre) {
                    return 1;
                }
                if (a.nombre < b.nombre) {
                    return -1;
                }
                //iguales
                return 0;
            });
            // console.log(listadoOrdenado);
            groupList = this.groupBy(listadoOrdenado, "nombre");
        } else {
            listadoOrdenado = this.state.data.sort(function (a, b) {
                if (a.codigo > b.codigo) {
                    return 1;
                }
                if (a.codigo < b.codigo) {
                    return -1;
                }
                //iguales
                return 0;
            });
            //  console.log(listadoOrdenado);
            groupList = this.groupBy(listadoOrdenado, "codigo");
        }
        let component = <Modal2 text={groupList} nombre={nom} codigo={id} estado={true} />;
        let node = document.createElement('div');
        ReactDOM.render(component, node);
    }

    expandirTabla(e) {
        if (!this.state.expand) {
            this.setState({ expand: true });
            e.target.innerHTML = "VER MENOS";
        } else {
            this.setState({ expand: false });
            e.target.innerHTML = "VER MÁS";
        }
        console.log(this.state.expand);
    }

    render() {
        const listado = this.state.data;
        console.log(listado);
        // cambio
        // Tambien hay un cambio en el boton Registrar y en los botones de observación con el atributo disabled
        var perfil = localStorage.getItem('perfil');
        var config = localStorage.getItem('config');
        var inactivo = false;
        var mostrar = '';
		console.log('perfil');
		console.log(perfil);
        if(perfil == '5'){
            inactivo = true;
        }else{
			inactivo = false;			
            //if(config == 'S') mostrar = 'none'
        }
        var contador = 1;	 
        return (

            <div className="table-scroll">
                <div className="botones">
                    {/* <div className="container">
                            <button id="btnNuevaR"  onClick={this.handleNuevo} className="btn btn-outline-success">Nueva</button>
                        </div> */}
                    <div className="contenedor-flex flex-sb">
                        <div>
                            <button className="btn btn-outline-primary" disabled={inactivo} onClick={e => this.expandirTabla(e)}>VER MÁS</button>
                        </div>
                        <div>
                            <button
                                id="Registrar"
                                onClick={this.handleEnviarData}
                                className="btn btn-outline-danger"
								disabled={inactivo}
                            >
                                Registrar
                            </button>
                        </div>
                    </div>
                </div>
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr className="tabla-cabecera">
                            <th>Nro</th>
                            <th>Nombre Apellido</th>
                            <th>Concepto</th>
                            <th>Descripcion</th>
                            <th>Programa</th>
                            <th>Codigo</th>
                            <th>Recibo</th>
                            <th>Moneda</th>
                            <th>Importe</th>
                            <th>Fecha</th>
                            <th>Ubicación</th>
                            <th>Verificar</th>
                            <th>Observaciones</th>
                            <th className={this.state.expand ? "" : "d-none"}>Asignar/Desasignar</th>
                            <th className={this.state.expand ? "" : "d-none"}>Cuenta del Banco</th>
                            <th className={this.state.expand ? "" : "d-none"}>Tipo de Carga</th>
                            
                        </tr>
                    </thead>
                    <tbody>{listado.map((dynamicData, i) =>
                        <tr key={i}>
                            <td style={dynamicData.validado? {display: ''}:{display: mostrar}}>{contador}</td>
                            <td style={dynamicData.validado? {display: ''}:{display: mostrar}} onClick={(e) => this.eventoNombre(e)} title="click para ver detalles" className="detalles" id={(dynamicData.codigo === "0") ? (dynamicData.nombre) : (dynamicData.codigo)}>{dynamicData.nombre}</td>
                            <td style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.concepto}</td>
                            <td style={dynamicData.validado? {display: ''}:{display: mostrar}} className="text-left">{dynamicData.descripcion_min}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.sigla_programa}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.codigo}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.recibo}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.moneda}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.mascara} {dynamicData.importe}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>{dynamicData.fecha.substring(0,10)}</td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>
                                <Combo
                                    items={this.state.ubicDato}
                                    val={this.handleChangeUbic}
                                    ubic={dynamicData.ubic}
                                    id_rec={dynamicData.id_rec}
                                />
                            </td>
							<td  style={dynamicData.validado? {display: ''}:{display: mostrar}}>
                                <Check
                                    validado={dynamicData.validado}
                                    id={dynamicData.id_rec}
                                    change={this.handleChangeEstado}
                                    disabled={true}
                                />
                            </td>
                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}} className="two-obs">
                                <button id={dynamicData.observacion} name={dynamicData.id_rec}
                                    onClick={(e) => this.openModal(dynamicData.id_rec, dynamicData.obs)} className="btn btn-primary">
                                    <span className="mybtn-red glyphicon glyphicon-eye-open"></span>
                                </button>
                                <button id={dynamicData.observacion} name={dynamicData.id_rec} disabled={inactivo}
                                    onClick={(e) => this.openModalUpg(dynamicData.id_rec, dynamicData.obs)} className="btn btn-primary">
                                    <span className="mybtn-blue glyphicon glyphicon-eye-open"></span>
                                </button>
                            </td>

                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}} className={this.state.expand ? "two-fields" : "d-none two-fields"}>
                                <button id={dynamicData.observacion_upg} name={dynamicData.id_rec}
                                    onClick={(e) => this.asignar_desasignar(dynamicData.recibo,dynamicData.codigo,dynamicData.id_programa,1,dynamicData.id_alum,dynamicData.nombre, dynamicData.fecha,dynamicData.sigla_programa)} className="btn btn-success">
                                    <FaCheck/>
                                </button>
                                <button id={dynamicData.observacion_upg} name={dynamicData.id_rec}
                                    onClick={(e) =>this.asignar_desasignar(dynamicData.recibo,dynamicData.codigo,dynamicData.id_programa,2,dynamicData.id_alum,dynamicData.sigla_programa)} className="btn btn-danger">
                                    <FaWindowClose/>
                                </button>
                            </td>

                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}} className={this.state.expand ? "" : "d-none"}>{dynamicData.tipo}</td>


                            <td  style={dynamicData.validado? {display: ''}:{display: mostrar}} className={this.state.expand ? "" : "d-none"}>{dynamicData.id_registro == 2103 ? "DIGITADO" : "REMITIDO"}</td>                         
                            <script>
                                {mostrar=='none'? (dynamicData.validado? contador++ : '') : contador++}
                            </script>

                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                </div>
            </div >

        );
    }
}

export default ListarComponentes;
