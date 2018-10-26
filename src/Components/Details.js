import React, { Component } from 'react' ;
import { Link } from 'react-router-dom' ;
import { Loader, GridContainer,LikeContainer,CommentContainer } from '../Containers' ;
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { sendRequest } from '../utils' ;
import ConfirmationMessage from './confirmationMessage' ;
import { getRequest } from '../utils' ;
import CreatableSelect from 'react-select/lib/Creatable';
import SnackBarComponent from './snackbar' ;
import {
  MenuItem,
  Menu,
  Avatar,
  Chip,
  Paper,
  Typography,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox ,
} from '@material-ui/core' ;
import {Animated} from "react-animated-css";

const styles = {
  img : {
    maxWidth : '100%' ,
    boxShadow : '5px 3px 5px #ccc' ,
    borderRadius : '6px'
  },
  container : {
    padding : '10px'
  },
  gridItem : {
    display: 'flex',
    alignItems : 'center' ,
    marginTop : '10px',
    paddingLeft : '15px',
  },
}



const Transition = (props) => <Slide direction = 'up' {...props} />


class AddTagsModal extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      open : this.props.isOpen , // if this modal is opened (will get it from OptionsMenu)
      item : this.props.item, // the current obj in the details page
      selectedTags : [], // the tags to be added
      allTags : null , // will get them on componentDidMount
      buttonDisabled : false , //
    }
  }

  componentWillReceiveProps = (nextProps,currentState) => {
    this.setState({item : nextProps.item,open : nextProps.isOpen}) ;
  }

  filterData = (data) => {
    // don't show the tags that already are attached to this image
      const extistingTags = [] ;
      this.state.item.tags.map(item => extistingTags.push(item.content))
      const result = data.filter((item) => extistingTags.indexOf(item.content) === -1 ) ;
      return result ;
  }


  // get all tags from database so the select-react component can disaply them
  getAllTags = () => {
    getRequest('images/tags')
    .then(resp => resp.json())
    .then(data => {
      const tags = this.filterData(data) ;
      this.prepareData(tags) ;
    })
  }


  // data should be of shape [{labe : '' ,value :''}] from select-react
  prepareData = (data) => {
    const result = [] ;
    data.map(item => result.push({label : item.content,value : item.id.toString()})) ;
    this.setState({allTags : result}) ;
  }


  componentDidMount = ()=> {
    this.getAllTags() ;
  }

  // send put request to add the new tags ;
  addTags = (endpoint) => {
    this.setState({buttonDisabled : true })
    let tagsString ='' ;
    // send tags as a list (when uploading new image i send then as string)
    this.state.selectedTags.map(item => tagsString += `${item.label}#`) ;
    tagsString = tagsString.substring(0,tagsString.length - 1)
    const payload = {tags_list : tagsString} ;
    sendRequest(`images${this.state.item.id}/`,payload,null,'PUT')
    .then(resp => resp.json())
    .then(data => {
      this.props.updateData(data) ;
      this.afterAddTags() ;
    })
  }


  // handle the change method of CreatableComponent ;
  onChange = (lstOfItems,action) => this.setState({selectedTags : lstOfItems}) ;

  // after the add proccess successe ;
  afterAddTags = () => {
    this.setState({selectedTags : [],buttonDisabled : false}) ;
    this.props.handleClose() ;
    this.props.showMessage('add') ;
  }

  render = () => {
    return (
      <Dialog

          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          open={this.state.open}
          onClose = {this.props.handleClose}
        >
          <DialogTitle id="alert-dialog-slide-title">
           {"Add Tags"}
          </DialogTitle>
          <DialogContent style = {{width : '400px',height : '200px'}}>
            <CreatableSelect closeMenuOnSelect = {false} value = { this.state.selectedTags } isMulti={true} options = {this.state.allTags} onChange = {this.onChange}/>
          </DialogContent>
          <DialogActions>

           <Button
             variant="contained"
             disabled = {this.state.buttonDisabled ||  this.state.selectedTags.length === 0  }
             onClick={()=>this.addTags(`images${this.state.id}`,)}
             color="primary"
             >
             Confirm
           </Button>
           <Button onClick={this.props.handleClose} color="secondary" variant="contained">
             Cancel
           </Button>
         </DialogActions>
      </Dialog>
    )

  }
}


class OptionsMenu extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      anchorEl : null,
      showConfirmrationDialog : false, // when user wnats to deleted an image
      showAddTagsModal : false , // when user wnats to add new tags
    }

  }

  handleClose = () => {

    // this function will be used inside the show ConfimationMessage component
    // and will result in the confirmationMessage receiving new props but the
    // this.state.showConfirmrationDialog still true so i should make the if else
    // the same goes for showAddTagsModal
    if (this.state.showConfirmrationDialog) {
      this.setState({ anchorEl: null,showConfirmrationDialog : false });
    } else if (this.state.showAddTagsModal) {
      this.setState({anchorEl : null ,showAddTagsModal : false })
    } else {
      this.setState({ anchorEl: null });
    }

  };


  // open and close the menu
  handleClick = (e) => {
     this.setState({ anchorEl: e.currentTarget });
  }

  afterImageDeletion = () => {
    this.props.history.push('/') ;
    setTimeout(()=>this.props.showMessage({messageContent : 'Deleted successfuly !'}) ,1000) ;

  }

  deleteImg = () => {
    // i added the tags list in the payload just because the serializer needs it
    // but it will make no difference ;
    const payload = {deleted : true,tags_list : 'asd'} ;
    sendRequest(`images${this.props.item.id}/`,payload,null,'PUT')
    .then(resp => {
      resp.status === 200 ? this.afterImageDeletion() : this.props.showMessage({messageContent : 'Could not delete the image'}) ;;
    })

  }

  handleDeleteClick = (e) => {
      this.handleClose(e) ;
      this.setState({showConfirmrationDialog : true}) ;
  }

  handleAddTagsClick = (e) => {
    this.handleClose(e) ;
    this.setState({showAddTagsModal : true})
  }

  render = () => {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 200,
            },
          }}
        >

          <MenuItem onClick={this.handleDeleteClick}>
            Delete
          </MenuItem>
          <MenuItem  onClick={this.handleAddTagsClick}>
            Add new tags
          </MenuItem>

        </Menu>


        <ConfirmationMessage
          message = {"you won't be able to undo once confirmed"}
          title = {"Are you sure you want to delete this ?"}
          open = {this.state.showConfirmrationDialog}
          confirm = {this.deleteImg}
          handleClose = {this.handleClose}
        />

        <AddTagsModal
          isOpen = {this.state.showAddTagsModal}
          item = {this.props.item}
          updateData = {this.props.updateData}
          handleClose = {this.handleClose}
          showMessage = {this.props.showInnerMessage}
        />
      </div>
    )
  }
}



const Tags = ({data,history}) => {

  return (
    <div>
      {
        data.map(item => {

          return (
            <Button style = {{margin : '5px'}} key = {item.id} variant="contained" color="primary" onClick = {() => history.push(`/?tags=${item.content}`)}>
              {item.content}
            </Button>
          )
        })
      }
    </div>
  )

}



export default class Details extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      data : this.props.data ,
      showMessage : false , // show success message after new tag addition or tag deletion
      messageContent : '' ,
    }

  }

  updateData = (obj) => {
    const {data} = this.state ;
    data.tags = obj.tags ;
    this.setState({data}) ;
  }


  componentWillReceiveProps = (nextProps,currentState) => {
    this.setState({data : nextProps.data}) ;
  }

  // this component has it's own showMessage method (will be used when user addes new image)
  // and it accepts showMessage props (will be used when user delete an image)
  showMessage = (type) => {
    const messageContent = type === 'delete' ? 'tags deleted successfuly' : 'tags added successfuly' ;
    this.setState({showMessage : true ,messageContent : messageContent})
  }

  // for messageComponent that belongs to this component
  hideMessage = () => this.setState({messageContent : '',showMessage : false})

  render = () => {
    const data = this.state.data ;
    const tags = data.tags ;
    let tagsString = '' ;
    tags.map(item => tagsString+=`,${item.content}`) ;
    const payload = {object_id : data.id.toString(),event_type:'like',content_type:'image'} ;
    const isLiked = data.is_liked_by_user ;

    return (

        <div style = {{backgroundColor : '#f4efef'}}>

          <Grid container spacing = {8} style = {styles.container}>

            <Grid item xs = {1} sm = {1}></Grid>

            <Grid item xs = {10} sm = {10}>

              <Paper style = {{padding : '10px'}}>
                <Grid container spacing = {32}>

                  <Grid item xs = {12} sm = {8}>
                    { data.is_owner ? <OptionsMenu
                      updateData  = { this.updateData }
                      item = {data}
                      history = {this.props.history}
                      showMessage = {this.props.showMessage}
                      showInnerMessage = {this.showMessage}
                      />: null

                    }

                    <img   alt = {data.id} src = {data.url} style = {styles.img}/>
                    <div style = {{width : '100%',height :'30px'}}></div>
                    <Tags data = {tags} history = {this.props.history}/>
                    <div style = {{width : '100%',height :'20px'}}></div>
                    <div style = {{paddingLeft : '5px'}}>
                      <LikeContainer payload = {payload} isLiked = {isLiked} endpoint = {'events'} likesNum = {data.likes_num}/>
                    </div>
                  </Grid>

                  <Grid item xs = {12} sm = {4}>
                    <Typography style = {{borderBottom : 'solid #ccc 1px',padding : '5px'}} component="h3" variant="display1" gutterBottom>Comments</Typography>
                    <CommentContainer imgHeight = {data.height} data = { data.comments } endpoint = {'comments'} objectId = {data.id} />
                  </Grid>

                </Grid>
              </Paper>

            </Grid>

            <Grid item xs = {1} sm = {1}></Grid>

          </Grid>

          <Grid container spacing = {8}>
            <Grid item xs = {1} sm = {1}></Grid>
            <Grid item xs = {10} sm = {10}>
              <Typography component="h2" variant="headline" gutterBottom>More like this</Typography>
            </Grid>
            <Grid item xs = {1} sm = {1}></Grid>
          </Grid>

          <div>

            <Loader loading = {''} endpoint = {`images?tags=${tagsString}`}><GridContainer /></Loader>
          </div>
          <SnackBarComponent
            open = {this.state.showMessage}
            message = {this.state.messageContent}
            onClose = {this.hideMessage}
          />
        </div>


    )
  }

}
