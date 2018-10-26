import React , { Component } from 'react' ;
import Loader from './Loader' ;
import { Details } from '../Components' ;
import { AppBar,Button,Toolbar } from '@material-ui/core' ;

export default class DetailsContainer extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      id : this.props.location.pathname.replace('/','') ,
    }

  }

  componentWillReceiveProps = (nextProps,currentState) => { 
    this.setState({id : nextProps.location.pathname.replace("/",'')}) ;
  }

  logout = () => {
    localStorage.removeItem('token') ;
    this.props.history.push('/login') ;
  }


  render = () => {
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button  color="inherit" onClick = {() => this.props.history.push('/')}>
              Back
            </Button>
            <Button  color="inherit" onClick = {this.logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Loader endpoint = {`images${this.state.id}`}>
          <Details showMessage = {this.props.showMessage} {...this.props} />
        </Loader>
      </div>

    )
  }
}
