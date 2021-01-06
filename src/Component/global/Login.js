import React,{Component} from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from './API/API'
import axios from 'axios'

import "./css/log.css";
class Login extends Component{

    constructor(props) {
        super(props);
         this.handleClick = this.handleClick.bind(this);
         this.handleLogin = this.handleLogin.bind(this);
        this.state = {
          username: "",
          password: ""
        }
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    async handleClick(e) {
        e.preventDefault()
        const URL = API.url;

        // cambio
// ---------------------------------------------------------------------------------------------------------------------------------
        console.log('prueba inicio');
        console.log('Username: ' + this.state.username);

        var perfil = '';
        await axios.get(
            URL+'perfil', 
            {params: {username: this.state.username}}
        ).then(response =>{
            perfil = response.data.data;
        }).catch(e => {
            console.log(e);
        })

        var config = '';
        await axios.get(
            URL+'config'
        ).then(response =>{
            config = response.data.data;
        }).catch(e => {
            console.log(e);
        })

        console.log('La configuracion es: ' + config)

        console.log('El perfil es ' + perfil);
        console.log('prueba fin');

// ---------------------------------------------------------------------------------------------------------------------------------
        try {
            const response = await axios.post(URL+'login',{
                username: this.state.username,
                password: this.state.password,
                },       
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }   
            })
            localStorage.setItem('user', true);
            localStorage.setItem('perfil', perfil);
            localStorage.setItem('config', config);
            window.location = '/';
        } catch (error) {
            console.log(error)
            alert("Usuario y/o contraseña incorrectos")
            document.location.reload(true)
        }
        
                
   }
   handleLogin() {
    console.log("USUARIO: " + this.state.usuario);
    console.log("Password: " + this.state.password);
    }

   handleChange = event =>{
        this.setState({
        [event.target.id]: event.target.value
        });
    }
    
    render(){
        return (
           <div class="containerx" >
            <div id="login" class="signin-card">
                
                <h1 class="display1">SIGAP</h1>
                

                 
                <div class="logo-image">
                    <img src="http://escuelamayorandrade.com/img/login.png" width="150" />
                   
                </div>
                
                

                
                <p class="subhead">LOGIN</p>
                <form onSubmit={this.handleClick} >
                    <FormGroup controlId="username" bsSize="large">
                       <ControlLabel className="username">Usuario:</ControlLabel>
                        <FormControl
                           autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChange}
                            placeholder="username"
                            className="user"
                        />
                    </FormGroup>
                  

                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel className="password">Contraseña:</ControlLabel>
                        <FormControl
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                        placeholder="ejm:123456"
                        className="pass"
                        />
                    </FormGroup>

                    <div class="centrar">
                        <Button 
                            block
                            
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            placeholder="Ingresar"
                            controlId="bot"
                            className="bot"
                            >
                            Ingresar
                        </Button>
                        

                    </div>



                </form>

            </div>
        </div>
        )
    }

}
export default Login;
