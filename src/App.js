import React from 'react';
import Moment from 'moment';
import logo from './logo.svg';
import './App.css';
import MySidebar from './sideBar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTrash, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

// const BasicPagination = ({}) => {
//   const classes = useStyles();
//   return (
//     <div className={classes.root}>
//       <Pagination onChange={handlePagination} count={10} />
//     </div>
//   );
// }



library.add(faTrash);
library.add(faCheckCircle);

class App extends React.Component {
  
  constructor(props){
    super(props);
    let pendingItems = JSON.parse(localStorage.getItem("pendingItems"))
    let completedItems = JSON.parse(localStorage.getItem("completedItems"))
    this.state = {
      pendingItems: pendingItems || [],
      completedItems: completedItems || [],
      currentItem: {
        task: "",
        key: ''
      }
    }
    this.items = [
      { name: 'home', label: 'Home' },
      {
        name: 'settings',
        label: 'Settings',
        items: [{ name: 'profile', label: 'Profile' }],
      },
    ]

  }

  handleInput = (e) => {
    this.setState({
      currentItem: {
        task: e.target.value,
        key: Date.now()
      }
    })
  }

  addItem = (e) => {
    e.preventDefault();
    if(this.state.currentItem.task === ""){
      return
    }
    const newItem = this.state.currentItem;
    const items = [...this.state.pendingItems, newItem];
    this.setState({
      pendingItems: items,
      currentItem: {
        task: '',
        key: ''
      }
    })
    localStorage.setItem("pendingItems", JSON.stringify(items));
    console.log(this.state)
  }
  
  deleteItem = (type, itemKey) => {
    
    if( type === "Pending"){
      const filteredItems = this.state.pendingItems.filter(item => item.key !== itemKey);
      this.setState({
        pendingItems: filteredItems
      })
      localStorage.setItem("pendingItems", JSON.stringify(filteredItems));
    }
    else{
      const filteredItems = this.state.completedItems.filter(item => item.key !== itemKey);
      this.setState({
        completedItems: filteredItems
      })
      localStorage.setItem("completedItems", JSON.stringify(filteredItems));
    }
    
  }
  
  markComplete = (itemKey) => {
    const completedItem = this.state.pendingItems.find(item => item.key === itemKey);
    
    const filteredItems = this.state.pendingItems.filter(item => item.key !== itemKey);
    this.setState({
      pendingItems: filteredItems
    })
    completedItem.key = Date.now();
    let completedItems = [...this.state.completedItems, completedItem];
    
    this.setState({
      pendingItems: filteredItems,
      completedItems: completedItems
    })
    localStorage.setItem("pendingItems", JSON.stringify(filteredItems));
    localStorage.setItem("completedItems", JSON.stringify(completedItems));
  }


  render(){

    return (
      <div className="App">
      <MySidebar items={this.items} />
      <h1>My TODO List</h1>
      <div className="row">
        <form id="add-task" onSubmit={this.addItem}>
          <input className="input" type="text" placeholder="Add task" value={this.state.currentItem.task} onChange={this.handleInput}/>
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="container">
        <TaskList items={this.state.pendingItems} className="full_list" type="Pending" deleteItem={this.deleteItem} markComplete={this.markComplete}/>
        <TaskList items={this.state.completedItems} className="full_list" type="Completed" deleteItem={this.deleteItem} markComplete={this.markComplete}/>
      </div>

      </div>
    );
  }
}


class TaskList extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            pageSize: 4,
            currentPage: 0
        }
    }
                                
    handlePagination = (event, page) => {
        let changeState = this.state;
        changeState['currentPage'] = page - 1;
        this.setState(changeState);
    }


    render(){
        this.props.items.sort((a,b) => (b.key > a.key) ? 1 : ((a.key > b.key) ? -1 : 0));
        let noOfPagesRequired = Math.ceil(this.props.items.length / this.state.pageSize);
        this.itemList = this.props.items.slice(this.state.currentPage * this.state.pageSize, (this.state.currentPage + 1)*4).map(item => (
        <div className="item" key={item.key} >
            <p className="item-data">
                {item.task}
                {this.props.type !== "Completed" && <FontAwesomeIcon className="faicons" icon="check-circle" onClick={() => this.props.markComplete(item.key)}/>}
                <FontAwesomeIcon className="faicons" icon="trash" onClick={() => this.props.deleteItem(this.props.type, item.key)}/>
            </p>
            <p id="date_subscript"><i><sub><small>Date modified: {Moment(item.key).format("DD-MM-YYYY h:mm")}</small></sub></i></p>
        </div>
        ))
        
        return(
            <div className={this.props.className}>
                <h2>{this.props.type}</h2>
                <div>
                    {this.itemList}
                </div>
                <Pagination className="pagination" onChange={this.handlePagination} count={noOfPagesRequired}/>
            </div>
        )
    }
}


export default App;
