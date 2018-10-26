import React , { Component } from 'react' ;
import { sendRequest } from '../utils' ;
import { CommentsList } from '../Components' ;
import { TextField,Button } from '@material-ui/core' ;

export default class CommentContainer extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      endpoint : this.props.endpoint ,
      objectId :this.props.objectId ,
      commentContent : '' ,
      data : this.props.data ,
      imgHeight : this.props.imgHeight
    }
  }

  comment = () => {
    this.setState({commentContent : ''})
    const payload = {content : this.state.commentContent,content_type :'image',object_id : this.state.objectId,is_parent : true} ;
    sendRequest(this.state.endpoint,payload)
    .then(resp => resp.json())
    .then(data => this.updateContent(data))
  }

  updateCommentContent = (e) => {
    this.setState({commentContent : e.target.value}) ;
  }

  updateContent = (obj) => {
    const { data } = this.state ;
    data.push(obj) ;
    this.setState({ data : data}) ;
  }

  componentWillReceiveProps = (nextProps,currentState) => {
      this.setState({data : nextProps.data,imgHeight : nextProps.imgHeight,objectId: nextProps.objectId}) ;
  }


  render = () => {

    return (
      <div className='comment-container'>
        <CommentsList imgHeight = { this.state.imgHeight }data = {this.state.data} />
        <div>
          <TextField
          style = {{width : '100%'}}
           label="Comment here ..."
           placeholder="Comment here ..."
           multiline
           margin="normal"
           variant="outlined"
           onChange = {this.updateCommentContent}
           value = {this.state.commentContent}
         />

       <Button disabled ={ !this.state.commentContent } variant="contained" color="secondary" onClick = {this.comment}>
         Comment
        </Button>
        </div>


      </div>
    )
  }
}
