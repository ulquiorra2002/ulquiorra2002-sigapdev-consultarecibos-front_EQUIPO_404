import React, {Component} from "react";
import './global/css/App.css';
import Header from './global/Header';
import Login from './global/Login';
import Footer from './global/Footer';
class CheckCollection extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Login />
                <Footer />
            </div>
        );
    }
}
export default CheckCollection;