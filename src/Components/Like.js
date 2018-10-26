import React from 'react' ;
import { Favorite } from '@material-ui/icons' ;

const Like = (props) => {
  const color = props.isLiked ? '#c64545' : '#444' ;
  return (
    <div style = {{display:'flex',alignItems : 'center'}}>
      <span style = {{color : color}} onClick = {props.action}><Favorite className = 'thumb'/></span>
      {props.likesNum > 0 && <span style = {{marginLeft : '10px',display : 'inline-block',color : color}}>{props.likesNum}</span>}
    </div>

  )
}

export default Like  ;
