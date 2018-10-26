import React from 'react' ;
import {
  Typography,
  Avatar ,
} from '@material-ui/core' ;
import { ImageIcon } from '@material-ui/icons' ;


const styles = {
    commentItem : {margin : '5px'} ,
    avatar : {height : '100%',display:'flex',alignItems : 'center'} ,
    body  : {padding : '5px',},
}

const CommentItem = ({content,username}) => {
  return (
    <div className = 'comment-item' style = {styles.commentItem}>
      <div className = 'avatar' style = {styles.avatar}>
        <Avatar style = {{marginRight : '10px'}}>{username.slice(0,1)}</Avatar>
        <Typography variant="caption" gutterBottom >{username}</Typography>
      </div>
      <div className = 'comment-item-body' style = {styles.body}>

        <Typography variant="body2" gutterBottom>{content}</Typography>
      </div>
    </div>

  )
}


const CommentsList = (props) => {

  return (
    <div className = 'comments-list' style = {{height : `350px`,overflowY : 'scroll'}}>
      {
        props.data.length > 0 ?
        props.data.map(item =>  <CommentItem key = {item.id} content = {item.content} username = {item.commentor.username}/> )
        :  <Typography component="h2" variant="display1" gutterBottom>No Comments yet, be the first </Typography>
      }
    </div>
  )

}



export default CommentsList
