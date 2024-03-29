import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import editingFields from './pages/editingFields/editingFields';
import notFound from './pages/notFound/notFound';
import * as serviceWorker from './serviceWorker';
import {usuarioAutenticado} from './services/auth';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';

const Permissao = ({component : Component}) => (
    <Route 
        render = {props => usuarioAutenticado() ?
        (<Component {...props} />) :
        (<Redirect to={{pathname: '/', state : {from : props.location}}} />)
        }
    />
);

const rotas = (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={editingFields} />
                <Route component={notFound} /> 
            </Switch>
        </div>
    </Router>
);

ReactDOM.render(rotas, document.getElementById('root'));
serviceWorker.unregister();
