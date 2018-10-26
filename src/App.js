import React, { Component } from 'react';
import { BrowserRouter, Route,Switch,Redirect } from 'react-router-dom' ;
import { Home,SnackBarComponent,Login } from './Components' ;
import { DetailsContainer } from './Containers' ;
import './styles/style.css' ;
import { sendRequest } from './utils' ;
import CircularProgress from '@material-ui/core/CircularProgress';


class PrivateRoute extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      status : this.props.status ,
      currentRenderedComponent : this.props.component.name ,
    }
  }


  // when showMessage is set to false the app then will rerender with the same component
  // so i should prevent this
  shouldComponentUpdate = (nextProps,nextState) => {

      // check if the current path is / cuz if it is /:id i need to update the page
      const result =  this.state.currentRenderedComponent === nextProps.component.name &&
            nextProps.location.pathname === '/' && !nextProps.location.search
            ? false : true ;
      return result ;
  }


  componentWillReceiveProps = (nextProps,currentState) => {
  
    this.setState({
      status : nextProps.status,
      currentRenderedComponent : nextProps.component.name
    })
  }

  render = () => {

      const showMessage = this.props.showMessage ;
      this.state.status === 400 ? localStorage.removeItem('token') : null ;
      return (
        <Route render = {(props) => (
            this.state.status === 400 ?<Redirect to ='/login' /> :
            <this.props.component {...props} showMessage = {showMessage} />
          )} />
      )
  }

}


class App extends Component {

  constructor() {
    super() ;
    this.state = {
      showMessage : null ,
      messageContent : null ,
      verifyStatus : null ,
    }
  }

  showMessage = (messageData) => {
    this.setState({showMessage : true,messageContent : messageData.messageContent})
  }

  handleClose  = () => {
    this.setState({ showMessage : false })
  }

  componentDidMount = () => {
    const token = localStorage.getItem('token') ;
    token ? this.verifyToken(token) : this.setState({verifyStatus : 400}) ;
  }

  // use this function in login component when the user log in so the staus will be 200
  // thus PrivateRoute will return the corresponded component
  setStatusToTrue = () => {
    this.setState({verifyStatus : 200})
  }

  verifyToken = (token) => {
    sendRequest('verify-token/',{token : token})
    .then(resp => this.setState({verifyStatus : resp.status})) ;
  }

  render() {

    return (
      <div>
        {!this.state.verifyStatus && <CircularProgress className = 'loading' /> }
        {
          this.state.verifyStatus &&
          <div>

            <BrowserRouter>
              <Switch>
                <Route path = '/login' render = {(props) => <Login {...props} setStatusToTrue = {this.setStatusToTrue} />} exact = {true}/>
                <PrivateRoute path = '/'  status = {this.state.verifyStatus} component = {Home} exact = {true} />
                <PrivateRoute path = '/:id' showMessage = {this.showMessage}  status = {this.state.verifyStatus} component = {DetailsContainer} exact = {true} />
              </Switch>
            </BrowserRouter>
            <SnackBarComponent
              open = {this.state.showMessage}
              message = {this.state.messageContent}
              onClose = { this.handleClose}
              />
          </div>
        }


      </div>

    );
  }
}

export default App;
