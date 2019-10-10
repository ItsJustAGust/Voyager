import React, {Component} from 'react';
import '../../Assets/css/editingFields.css'
import menu from '../../components/menu/menu';

export default class editingFields extends Component{
    
    constructor(){
        super();

        this.state={
            id: '',
            name:'',
            fieldType: '',
            required: false,
            status: false,
            lista:[]
        }

        this.atualizaEstadoNomeForm = this.atualizaEstadoNome.bind(this);
        this.atualizaEstadoTipodeCampoForm = this.atualizaEstadoTipodeCampo.bind(this);
        this.atualizaEstadoObrigatoriedadeForm = this.atualizaEstadoObrigatoriedade.bind(this);
        this.buscarPorIdForm = this.buscarPorId.bind(this);
    }
      
    atualizaEstadoNome(event){
        this.setState({name: event.target.value})
    }

    atualizaEstadoTipodeCampo(event) {
        this.setState({fieldType: event.target.value},() =>{
        console.log(this.state.fieldType)
        })
    }

    atualizaEstadoObrigatoriedade(event){
        this.setState({required: event.target.value})
    }

    buscarCampos(){
        fetch('https://5d8289a9c9e3410014070b11.mockapi.io/document',{
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        .then(resposta => resposta.json())
        .then(data => this.setState({lista : data}))
        .catch(erro => console.log(erro))
    }

    componentDidMount(){
        this.buscarCampos();
    }

    buscarPorId(event){
        event.preventDefault();
        console.log('https://5d8289a9c9e3410014070b11.mockapi.io/document/' + event.target.getAttribute('id'));
        fetch('https://5d8289a9c9e3410014070b11.mockapi.io/document/' + event.target.getAttribute('id'),{
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => this.setState({ 
            id: data.id,
            name: data.name,
            fieldType: data.fieldType,
            required: data.required,
            status: data.status    
        }))
        .catch(erro => console.log(erro))
    }

    editarStatus = (event) => {
        event.preventDefault();

        fetch('https://5d8289a9c9e3410014070b11.mockapi.io/document/' + event.target.getAttribute('id'),{
            method:'PUT',
            body: JSON.stringify({
                status: (event.target.getAttribute('status') === 'statusTrue' ? false : true )
            }),
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        .then(response => {
            this.buscarCampos()
        })
        .catch(erro => console.log(erro))
    }

    cadastrarCampo(event){
        event.preventDefault();
        console.log(this.state.id);

        if(this.state.id != ''){
            fetch('https://5d8289a9c9e3410014070b11.mockapi.io/document/'+ this.state.id,{
                method:'PUT',
                body: JSON.stringify({
                    id: this.state.id,
                    name: this.state.name,
                    fieldType: this.state.fieldType,
                    required: (this.state.required === 'on' ? true : false)
                }),
                headers:{
                    'Content-Type' : 'application/json'
                }
            }).then(() =>{
                this.setState({id : ''})
                this.buscarCampos();
            })
        } else {
            fetch('https://5d8289a9c9e3410014070b11.mockapi.io/document',{
                method:'POST',
                body: JSON.stringify({
                    name: this.state.name,
                    fieldType: this.state.fieldType,
                    required: (this.state.required === 'on' ? true : false)
                }),
                headers:{
                    'Content-Type' : 'application/json'
                }
            })
            .then(response => response)
            .then(this.buscarCampos.bind(this))
            .catch(erro => console.log(erro))         
        }
    }
        
    render(){
        const root = this;
        return(
            <div>

            <section className="cadastrinho">
                <form onSubmit={this.cadastrarCampo.bind(this)}>
                <div className="nomeInput">
                    <input type="text" name="nameCampo" value={this.state.name || ''} onChange={this.atualizaEstadoNomeForm}/> 
                    <label>Nome do Campo*</label>
                </div>

                <div className="listaTipos">
                    <input type="radio" name="tipo" value="list" checked={this.state.fieldType === 'list'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>List</label>

                     <input type="radio" name="tipo" value="multiple-selection" checked={this.state.fieldType === 'multiple-selection'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>Multiple-Selection</label>

                     <input type="radio" name="tipo" value="text" checked={this.state.fieldType === 'text'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>Text</label>

                     <input type="radio" name="tipo" value="numeric" checked={this.state.fieldType === 'numeric'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>Numeric</label>

                     <input type="radio" name="tipo" value="date" checked={this.state.fieldType === 'date'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>Date</label>

                     <input type="radio" name="tipo" value="checkbox" checked={this.state.fieldType === 'checkbox'} onChange={this.atualizaEstadoTipodeCampoForm}></input>
                    <label>Checkbox</label>
                </div>

                <div className="obrigation">
                    <input type="checkbox" id="obrigatorio" defaultchecked={this.state.required = 'true'} onChange={this.atualizaEstadoObrigatoriedadeForm}></input>
                    <label>Obrigátorio para o Document</label>
                </div>

                <div className="salvaCampo">
                    <button type="submit">Salvar</button>
                </div>
        
            </form>
            </section>

             <section className="listinha">
                <table id="tabela">
                <tbody>
                        {
                            this.state.lista.map(function(document){
                                   if(document.status){
                                    return(
                                        <tr key={document.id}>
                                        <td>{document.name}</td>
                                        <td>{document.fieldType}</td>
                                        <td>{document.required.toString()}</td>
                                        <td>{document.status.toString()}</td>
                                        <button type='submit' id={document.id} onClick={root.buscarPorIdForm}>Editar</button>
                                        <button id={document.id} status={document.status ? "statusTrue" : "statusFalse"} onClick={root.editarStatus}>Excluir</button>
                                    </tr>
                                );
                                   }
                            })       
                        } 
                 </tbody>
                </table>
            </section>
               </div>
        )
    }
}