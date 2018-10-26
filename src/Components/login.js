import React , { Component } from 'react' ;
import { sendRequest } from '../utils' ;
import SnackBarComponent from './snackbar' ;
import {
  Grid,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Typography
} from '@material-ui/core'

import {
  Lock,
  AccountCircle,
} from '@material-ui/icons' ;


const styles = {
  paper : {
    marginTop : '10%',
    padding : '30px 10px' ,
  }
}
export default class Login extends Component {

  constructor(props){
    super(props)  ;
    this.state = {
      username : '',
      password : '' ,
      showErrorMessage : false ,
    }

    const token = localStorage.getItem('token') ;
    token ? this.props.history.push('/') : null ;
  }

  handleChange = (e) => {
    const type = e.target.name ;
    this.setState({ [type] : e.target.value })
  }

  closeMessageError = () => {
    this.setState({showErrorMessage : false })
  }

  login = () => {
    const payload = {username : this.state.username,password : this.state.password}
    sendRequest('api-token-auth/',payload)
    .then(resp => {
      if (resp.status === 400) {
        this.setState({showErrorMessage : true})
      } else {
        resp.json().then(data => {
          localStorage.setItem("token" , data.token ) ;
          this.props.setStatusToTrue() ;
          this.props.history.push("/") ;

        }) ;
      }
    })


  }

  render = () => {
    return (
      <div className = 'login-container'>
        <div className = ' login-form'>
          <Grid container spacing = {32}>
          <Grid item xs = {false} sm = {4}></Grid>
          <Grid item xs ={10} sm = {3}>
            <Paper style = {styles.paper}>
              <Grid container spacing = {8}>

                <Grid item xs = {12} sm = {12}>
                  <h3>Welcome</h3>
                  <img id = 'logo' src = './angular.png' />
                </Grid>
                <Grid item xs = {12} sm = {12}>
                <TextField
                  placeholder = "Username"
                  name = 'username'
                  onChange = {this.handleChange}
                />
                </Grid>

                <Grid item xs = {12} sm = {12}>
                  <TextField
                    type = 'password'
                    name = 'password'
                    onChange = {this.handleChange}
                    placeholder = "Password"
                  />
                </Grid>
                <Grid item xs = {12} sm = {12}>
                <Button className = 'login-submit' disabled = {!this.state.username || !this.state.password } variant="contained" color="secondary" onClick = {this.login}>
                  Login
                </Button>
                </Grid>

                <Grid item xs = {12} sm = {12}>
                  <div style = {{height :"50px",width : '100%'}}></div>
                  <Typography gutterBottom noWrap>
                    {`
                    Don't have an Account ? sign up
                  `}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          <Grid item xs = {false} sm = {4}></Grid>

          </Grid>

        </Grid></div>
        <SnackBarComponent
          message = {'invalid username/password combination !'}
          open = {this.state.showErrorMessage}
          onClose = {this.closeMessageError}
        />
      </div>

    )
  }
}
