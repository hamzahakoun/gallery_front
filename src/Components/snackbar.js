import React, { Component } from 'react' ;
import { Snackbar } from '@material-ui/core' ;
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


// a general component to show message after operations such as (uploading image/deleting image)
export default class SnackBarComponent extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      // will get it's value (whetherr should be appear or not from the parent component)
      open : this.props.open,
      messageContent : this.props.message
    }
  }

  componentWillReceiveProps = (nextProps,currentState) => {
    this.setState({open : nextProps.open,messageContent : nextProps.message})
  }

  // perform the close method provided by the parent component ;
  handleClose = () => {
    this.props.onClose() ;
  }

  render =() => {
    return (
      <Snackbar
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'left',
           }}
           open={this.state.open}
           autoHideDuration={6000}
           onClose={this.handleClose}
           ContentProps={{
             'aria-describedby': 'message-id',
           }}
           message={<span>{this.state.messageContent}</span>}
           action={[
             <IconButton
               key="close"
               aria-label="Close"
               color="inherit"
               onClick={this.handleClose}
             >
               <CloseIcon />
             </IconButton>,
           ]}
         />
    )
  }
}
