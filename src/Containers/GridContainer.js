import React , { Component } from 'react' ;
import { Grd,SnackBarComponent } from '../Components' ;
import { getRequest,sendRequest } from '../utils' ;
import AddIcon from '@material-ui/icons/Add';
import '../styles/grid.css' ;
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Slide,
  Button
} from '@material-ui/core' ;

import CreatableSelect from 'react-select/lib/Creatable';


const Transition = (props) => <Slide direction = 'up' {...props} />

class AddImageForm extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      allTags : [] ,
      selectedTags : [] ,
      selectFile : undefined,
      selectFileName : undefined,
      imgSrc : undefined,
      value : '' ,
      modalOpen : this.props.isOpened ,
      buttonDisabled : false,

    }
  }

  componentWillReceiveProps = (nextProps,currentState) => {
    this.setState({modalOpen : nextProps.isOpened}) ;
  }


  handleChange = (lstOfItems,action) => {
    this.setState({selectedTags : lstOfItems});
  }

  // upload file
  selectFile = (e) => {

    this.setState({
      selectedFile : e.target.files[0],
      selectFileName : e.target.files[0].name ,
      imgSrc : window.URL.createObjectURL(e.target.files[0]),
      value : e.target.files[0].value ,
    })
  }

  afterSuccessfulUpload = () => {
    this.setState({
       selectedFile: undefined,
       selectedFileName: undefined,
       imageSrc: undefined,
       value: '',
       buttonDisabled : false,
       selectedTags : [] ,
   })
  }
  // send a request to upload new image
  sendAddRequest = (endpoint) => {
    this.setState({buttonDisabled : true})
    let tagsString = '' ;
    this.state.selectedTags.map(item => tagsString += `${item.label}#`)
    tagsString = tagsString.substring(0,tagsString.length -1) ;

    const fd = new FormData() ;
    fd.append('url',this.state.selectedFile,this.state.selectFileName) ;
    fd.append('tags_list',tagsString) ;
    sendRequest(endpoint,fd,null,'POST',true)
    .then(resp => resp.json())
    .then(data => {
      // will receive the shouldAppendData from the grid container which will be true or false
      // if the current path is the details or likes path shouldAppendData will be false else
      // true
      this.props.appendData ? this.props.appendData(data) : null ;
      this.props.close() ;
      this.afterSuccessfulUpload() ;
      this.props.showMessage({messageContent : 'Image uploaded successfuly'}) ;

    }).catch(e => console.log(e)) ;
  }


  componentDidMount = () => {
    this.getAllTags('images/tags') ;
  }

  getAllTags = (endpoint) => {
    getRequest(endpoint)
    .then(resp=>resp.json())
    .then(data => this.prepareData(data))
  }


  // covert data to the form [{label : value,value : value}] to use it in the searchable select
  prepareData = (data) => {
    const result = [] ;
    data.map(item => result.push({label : item.content,value : item.id.toString()})) ;
    this.setState({allTags : result}) ;
  }

  render = () => {

    return (
        <div>
            <Dialog
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                open={this.state.modalOpen}
                onClose = { this.props.close }

              >
                <DialogTitle id="alert-dialog-slide-title">
                 {"Upload an Image"}
                </DialogTitle>
                <DialogContent style = {{width : '400px',height : '300px'}}>
                  <input type = 'file' onChange = {this.selectFile} value = {this.state.value}/><br /><br /><br />
                  <CreatableSelect closeMenuOnSelect = {false} value = { this.state.selectedTags } isMulti={true} options = {this.state.allTags} onChange = {this.handleChange}/>
                </DialogContent>
                <DialogActions>

                 <Button
                   variant="contained"
                   disabled = {this.state.buttonDisabled || this.state.value === '' || this.state.selectedTags.length === 0  }
                   onClick={()=>this.sendAddRequest('images')}
                   color="primary"
                   >
                   Confirm
                 </Button>
                 <Button onClick={this.props.close} color="secondary" variant="contained">
                   Cancel
                 </Button>
               </DialogActions>
            </Dialog>
        </div>


    )
  }
}


export default class GridContainer extends Component {

  constructor(props) {
    super(props) ;
      this.state = {
        data : this.props.data  , // inital data
        open : false, // to control the upload image modal
        showMessage : false ,
        messageContent : null,
        shouldAppendData : this.props.endpoint === 'images' || this.props.endpoint === 'images?tags=' ,
      }

  }


  // add the new uploaded image to the grid
  appendData = (obj) => {
    let {data} = this.state ;
    data.push(obj) ;
    this.setState({data : data }) ;
  }

  // show the snackbar component after successful uploading or deletion
  showMessage = (messageData) => {
    this.setState({ showMessage : true,messageContent : messageData.messageContent })
  }


  // close the snackbar component
  handleMessageClose = ()=>this.setState({showMessage : false,messageContent : ''}) ;

  componentWillReceiveProps = (newProps,currentState) =>{
    this.setState({data : newProps.data})
  }



  // open the add image modal
  handleOpen = () =>  this.setState({open : true}) ;


  // close the add image modal
  handleClose = () => this.setState({open : false})


  render = () => {

    const appendData = this.state.shouldAppendData ? this.appendData : null ;
    return (
      <div className = 'grid-container' style = {{position : 'relative'}}>
        {this.state.data && <Grd data = {this.state.data} /> }

        <Button onClick = { this.handleOpen } variant="fab" color="secondary" aria-label="Add" style = {{position : 'fixed',right : '5%',bottom : '7%'}}>
          <AddIcon />
        </Button>

        <AddImageForm
          showMessage = { this.showMessage }
          isOpened = { this.state.open }
          close = {this.handleClose}
          appendData = {appendData}
        />
        <SnackBarComponent
          open = {this.state.showMessage}
          message = {this.state.messageContent}
          onClose = {this.handleMessageClose}
          />
      </div>
    );
  }

}
