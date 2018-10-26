import React , { Component } from 'react' ;
import { sendRequest,deleteRequest } from '../utils' ;
import { Like } from '../Components' ;


export default class LikeContainer extends Component {

  constructor(props) {
    super(props) ;
    this.state = {
      isLiked : this.props.isLiked ,
      payload : this.props.payload,
      endpoint : this.props.endpoint,
      likesNum : this.props.likesNum ,
    }

  }

  componentWillReceiveProps =  (newProps) => {
    this.setState({
      isLiked : newProps.isLiked,
      payload:newProps.payload,
      endpoint : newProps.endpoint,
      likesNum : newProps.likesNum})
  }

  like = () => {
    const payload = this.state.payload ;
    const endpoint = this.state.endpoint ;
    sendRequest(endpoint,payload)
    .then(resp => resp.json())
    .then(data => {
      if (this.state.likesNum !== null ) {
        this.setState((prevState,currentPorps) => {
          return {isLiked : true ,likesNum : prevState.likesNum + 1 }
        })
      } else {
        this.setState({isLiked : true })
      }
    })
  }


  dislike = () => {
    const endpoint = `images${this.state.payload.object_id}` ;
    deleteRequest(endpoint,null)
    .then(resp => {
      if (this.state.likesNum != null) {
        this.setState((prevState,currentPorps) => {
          return {isLiked : false ,likesNum : prevState.likesNum - 1 }
        })
      } else {
        this.setState({isLiked : false })
      }
    })

  }


  render = () => {

    return(
      <div className ='like-container'>
        {!this.state.isLiked &&  <Like isLiked = {false} action = {this.like} likesNum = {this.state.likesNum}/>}
        {this.state.isLiked && <Like isLiked = {true} action = {this.dislike} likesNum = {this.state.likesNum} />}
      </div>
    )
  }

}
