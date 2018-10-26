import React , { Component } from 'react' ;
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from "@material-ui/core" ;

const Transition = (props) => <Slide direction="up" {...props} />;



export default class ConfimationMessage extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      open : this.props.open ,
    }
  }

  handleClose = () => {

    if (this.props.handleClose) {
      this.setState((prevState)=>{
        return {open : false}
      },() => {this.props.handleClose()})

    } else {
      this.setState({open : false})
    }
  }

  componentWillReceiveProps = (nextProps,currentState) => {
    this.setState({open : nextProps.open}) ;
  }

  render = () => {

    return (
      <div>
       <Dialog
         open={this.state.open}
         onClose={this.handleClose}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
         TransitionComponent = {Transition}
       >
         <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description">
             {this.props.message}
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={this.props.confirm} color="secondary">
             Confirm
           </Button>
           <Button onClick={this.handleClose} color="primary" autoFocus>
             Cancel
           </Button>
         </DialogActions>
       </Dialog>
     </div>
    )
  }

}
