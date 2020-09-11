import React from 'react';
import './App.css';
class App extends React.Component{
   constructor(props){
      super(props);
      this.state = {
        todolist:[],  
        activetask:{
          id:null,
          title:'',
          completed:false,
        },
        edit:false,
      }
      this.fetchTasks=this.fetchTasks.bind(this)
      this.handleChange=this.handleChange.bind(this)
      this.handleSubmit=this.handleSubmit.bind(this)
      this.deletetask=this.deletetask.bind(this)
      this.getCookie=this.getCookie.bind(this)
   };
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
   componentWillMount(){
     this.fetchTasks()
   };
   handleChange(e){
      var name=e.target.name;
      var value=e.target.value;
      console.log(value)
    this.setState({
      activetask:{
        ...this.state.activetask,
        title:value
      }
    })
    };
    handleSubmit(e){
      e.preventDefault()
      var csrf_token=this.getCookie('csrftoken')
      console.log('ITEM',this.state.activetask)
      var url='http://127.0.0.1:8000/task_create/';
      if(this.state.edit  == true){
        url=`http://127.0.0.1:8000/task_update/${ this.state.activetask.id}`;
        this.setState({
          edit:false
        })  
      } 
      fetch(url,{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrf_token,
        },
        body:JSON.stringify(this.state.activetask)
      }).then((response)=>{
        this.fetchTasks()
        this.setState({
          activetask:{
            id:null,
            title:'',
            completed:false,
          }
        })
      }).catch(function(error){
        console.log('ERROR',error)
      })
    }
   fetchTasks(){
      console.log('Fetching ..')
      fetch('http://127.0.0.1:8000/task_list/')
      .then(response=>response.json())
      .then(data =>
        this.setState({
          todolist:data
        }) 
      )
   };
   startedit(task){
    this.setState({
      activetask:task,
      edit:true,
    })
   }
   deletetask(task){
    var csrf_token=this.getCookie('csrftoken')
    var url=`http://127.0.0.1:8000/task_delete/${task.id}`;
    fetch(url,{
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
          'X-CSRFToken':csrf_token,
      },
    }).then((response)=>{
      this.fetchTasks() 
    })
   }
  render(){
    var tasks=this.state.todolist;
    var self=this;
    return(
      <div className="container">
      <h1> CRUD System Using React And Django</h1>
        <form  onSubmit={this.handleSubmit} action="">
        <div className="form-group">
          <input className="form-control"onChange={this.handleChange} value={this.state.activetask.title} name='title'/>   
          </div>
          <div className="form-group" >
          <input className="btn btn-primary" type="submit" />          
          </div>
        </form>
        <div>
  <table className="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <td scope="col">Task Detail</td>
      <td scope="col">View</td>
      <td scope="col" >Delete</td>
    </tr>
  </thead>
  <tbody>
                  {tasks.map(function(task,index){
              return  (
                <tr>
                  <th scope="row">{index+1}</th>
                  <td><span>{task.title}</span></td>
                  <td>
                  <button id="inner_button" className="btn btn-success" onClick={() => self.startedit(task)}> Edit</button>
                  </td>
                  <td>
                  <button onClick={() => self.deletetask(task)} className="btn btn-danger">delete</button>
                  </td>
                </tr>
              )
            })}
            </tbody>
</table>
        </div>
      </div>

    )
  }
}
export default App;